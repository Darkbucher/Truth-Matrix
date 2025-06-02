import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface VerificationRequest {
  claim: string;
  sources: string[];
  comfortSettings: {
    comfortLevel: number;
    challengingOpinions: boolean;
    controversialTopics: boolean;
    biasIndicators: boolean;
    sourceDiversity: boolean;
  };
}

interface SourceInfo {
  name: string;
  type: string;
  description: string;
  reliability: number; // 1-10
}

interface VerificationResponse {
  summary: string;
  accuracy: number;
  points: string[];
  biases: string[];
  sources: SourceInfo[];
}

// Define available source data
const availableSources: Record<string, SourceInfo[]> = {
  academic: [
    { name: 'Google Scholar', type: 'academic', description: 'Academic research matching your query', reliability: 9 },
    { name: 'JSTOR', type: 'academic', description: 'Academic research matching your query', reliability: 9 },
    { name: 'PubMed', type: 'academic', description: 'Academic research matching your query', reliability: 9 }
  ],
  news: [
    { name: 'Reuters', type: 'news', description: 'News articles related to your query', reliability: 8 },
    { name: 'AP News', type: 'news', description: 'News articles related to your query', reliability: 8 },
    { name: 'BBC News', type: 'news', description: 'News articles related to your query', reliability: 8 }
  ],
  factCheck: [
    { name: 'Snopes', type: 'fact-check', description: 'Fact-checks addressing related claims', reliability: 8 },
    { name: 'FactCheck.org', type: 'fact-check', description: 'Fact-checks addressing related claims', reliability: 8 },
    { name: 'PolitiFact', type: 'fact-check', description: 'Fact-checks addressing related claims', reliability: 8 }
  ],
  scientific: [
    { name: 'Nature', type: 'scientific', description: 'Scientific papers matching your criteria', reliability: 10 },
    { name: 'Science.org', type: 'scientific', description: 'Scientific papers matching your criteria', reliability: 10 },
    { name: 'arXiv', type: 'scientific', description: 'Scientific papers matching your criteria', reliability: 9 }
  ]
};

// Add custom error types
class VerificationError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'VerificationError';
  }
}

class APIKeyError extends VerificationError {
  constructor(message: string = 'API key configuration error') {
    super(message, 500);
    this.name = 'APIKeyError';
  }
}

// Add retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize Gemini API with REST endpoint
const generateContent = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
  console.log('API Key length:', apiKey?.length);
  
  if (!apiKey) {
    throw new APIKeyError('GOOGLE_AI_API_KEY environment variable is not set');
  }
  if (apiKey.length < 10) {
    throw new APIKeyError('Invalid API key format');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Add response validation schema
const validateVerificationResponse = (response: any): response is Omit<VerificationResponse, 'sources'> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.summary === 'string' &&
    typeof response.accuracy === 'number' &&
    response.accuracy >= 0 &&
    response.accuracy <= 100 &&
    Array.isArray(response.points) &&
    response.points.every((point: any) => typeof point === 'string') &&
    Array.isArray(response.biases) &&
    response.biases.every((bias: any) => typeof bias === 'string')
  );
};

const verify = async (req: Request, res: Response) => {
  let retryCount = 0;
  let selectedSources: SourceInfo[] = [];
  
  try {
    const { claim, sources, comfortSettings } = req.body as VerificationRequest;

    if (!claim || typeof claim !== 'string' || claim.trim().length === 0) {
      throw new VerificationError('Valid claim is required', 400);
    }

    if (!Array.isArray(sources) || sources.length === 0) {
      throw new VerificationError('At least one source type is required', 400);
    }

    // Get relevant sources based on user selection
    sources.forEach(sourceType => {
      if (availableSources[sourceType]) {
        selectedSources.push(...availableSources[sourceType]);
      }
    });

    // Prepare prompt based on comfort settings
    let prompt = `Act as a digital truth verification system named Matrix·Truth. Your goal is to analyze and verify the following claim in the style of a Matrix-themed information verification tool:

CLAIM: "${claim}"

Based on the following information sources: ${selectedSources.map(s => s.name).join(', ')}
    
Please conduct a comprehensive cross-reference verification process to determine the accuracy of this claim.`;
    
    // Add comfort level instructions
    if (comfortSettings) {
      prompt += `\n\nThe user's comfort level with challenging information is ${comfortSettings.comfortLevel}% (where 0% means maximum truth, 100% means maximum comfort). `;
      
      if (comfortSettings.comfortLevel < 30) {
        prompt += 'Prioritize raw, unfiltered truth regardless of how challenging the information may be. Be very direct and blunt with your assessment.';
      } else if (comfortSettings.comfortLevel > 70) {
        prompt += 'Present information in the most gentle and comforting way possible, while still being accurate. Soften potentially disturbing information when possible.';
      } else {
        prompt += 'Maintain a balance between truth and comfort, presenting facts clearly but with sensitivity.';
      }
      
      // Add preferences about content
      prompt += '\n\nAdditional preferences:';
      
      if (!comfortSettings.challengingOpinions) {
        prompt += '\n- Avoid presenting strongly challenging opinions';
      }
      
      if (!comfortSettings.controversialTopics) {
        prompt += '\n- Minimize exposure to highly controversial perspectives';
      }
      
      if (comfortSettings.biasIndicators) {
        prompt += '\n- Do highlight potential biases in the information';
      }
      
      if (comfortSettings.sourceDiversity) {
        prompt += '\n- Prioritize diverse perspectives from different sources';
      }
    }
    
    // Add instructions for response format
    prompt += `\n\nFormat your response as a JSON object with the following structure:
    {
      "summary": "A comprehensive yet concise summary of your findings, 2-3 sentences maximum",
      "accuracy": a number between 0-100 representing the percentage accuracy of the claim,
      "points": ["3-5 bullet points supporting your analysis, each 1-2 sentences"],
      "biases": ["2-3 potential biases or limitations in the available information"]
    }
    
    Make your response helpful, accurate, and concise. ONLY return valid JSON, no other text.`;

    console.log("Sending prompt to Gemini API:", prompt);

    try {
      const responseText = await generateContent(prompt);
      console.log('Original response text:', responseText);
      
      // Clean and parse the response
      const cleanResponse = responseText
        .replace(/```json\s*|\s*```/g, '') // Remove code blocks
        .replace(/\n/g, '') // Remove newlines
        .trim(); // Remove extra whitespace
      
      console.log('Cleaned response text:', cleanResponse);
      
      const parsedResponse = JSON.parse(cleanResponse);
      
      // Validate the parsed response
      if (!validateVerificationResponse(parsedResponse)) {
        throw new VerificationError('Invalid response format from AI model', 500);
      }
      
      // Add sources to the response
      const fullResponse: VerificationResponse = {
        ...parsedResponse,
        sources: selectedSources
      };
      
      console.log('Final response being sent to client:', JSON.stringify(fullResponse));
      return res.status(200).json(fullResponse);
    } catch (error: unknown) {
      console.error('Failed to parse AI response:', error);
      
      // Return a fallback response with sources
      const fallbackResponse: VerificationResponse = {
        summary: "We couldn't generate an AI summary at this time, but here are the relevant sources you can check:",
        accuracy: 50,
        points: [
          "The verification system encountered a temporary issue",
          "You can still access all the selected sources below",
          "Try again in a few minutes for the full analysis"
        ],
        biases: ["Limited to source information only"],
        sources: selectedSources
      };
      
      return res.status(200).json(fallbackResponse);
    }
  } catch (error: unknown) {
    console.error('Verification error:', error);
    
    if (retryCount < MAX_RETRIES - 1) {
      retryCount++;
      throw error; // Let the outer catch handle the retry
    }
    
    // Always return sources even on error
    const errorResponse: VerificationResponse = {
      summary: "An error occurred while verifying the claim. Here are the relevant sources you can check:",
      accuracy: 50,
      points: [
        "The verification system encountered an error",
        "You can still access all the selected sources below",
        "Try again in a few minutes for the full analysis"
      ],
      biases: ["Limited to source information only"],
      sources: selectedSources
    };
    
    return res.status(200).json(errorResponse);
  }
};

export default verify;
