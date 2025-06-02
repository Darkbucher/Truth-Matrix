import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testGeminiAPI() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
    }

    console.log('Environment loaded successfully');
    console.log('API Key length:', apiKey.length);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = "Write a story about a magic backpack.";
    console.log('\nSending prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('\nResponse from Gemini API:');
    console.log('------------------------');
    console.log(text);
    console.log('------------------------');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

testGeminiAPI(); 