import { Request, Response } from "express";
import fetch from "node-fetch";
import { searchWeb, type SearchResult } from "../lib/search";
import { VerificationResultSchema, verifications } from "../../shared/schema";
import { db } from "../db";
import { nanoid } from "nanoid";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VerificationRequest {
  claim: string;
  sources: string[];
}

interface SourceInfo {
  name: string;
  type: string;
  description: string;
  reliability: number; // 1–10
}

interface VerificationResponse {
  summary: string;
  verdict: "well-supported" | "mostly-true" | "disputed" | "likely-false" | "unverifiable";
  accuracy: number; // 0–100, epistemically calibrated
  points: string[];
  biases: string[];
  sources: SourceInfo[];
}

// ─── Source Registry ──────────────────────────────────────────────────────────

const SOURCE_REGISTRY: Record<string, SourceInfo[]> = {
  academic: [
    { name: "Google Scholar", type: "academic", description: "Peer-reviewed academic research", reliability: 9 },
    { name: "JSTOR",          type: "academic", description: "Scholarly journals and primary sources", reliability: 9 },
    { name: "PubMed",         type: "academic", description: "Biomedical and life science literature", reliability: 9 },
  ],
  news: [
    { name: "Reuters",  type: "news", description: "International wire service news", reliability: 8 },
    { name: "AP News",  type: "news", description: "Non-profit newswire journalism", reliability: 8 },
    { name: "BBC News", type: "news", description: "UK public broadcaster reporting", reliability: 8 },
  ],
  factCheck: [
    { name: "Snopes",        type: "fact-check", description: "Long-running misinformation research", reliability: 8 },
    { name: "FactCheck.org", type: "fact-check", description: "Non-partisan fact-checking organization", reliability: 8 },
    { name: "PolitiFact",    type: "fact-check", description: "Pulitzer-winning political fact checker", reliability: 8 },
  ],
  scientific: [
    { name: "Nature",      type: "scientific", description: "Multidisciplinary science journal", reliability: 10 },
    { name: "Science.org", type: "scientific", description: "AAAS peer-reviewed science", reliability: 10 },
    { name: "arXiv",       type: "scientific", description: "Open-access preprint server", reliability: 9 },
  ],
};

// ─── Gemini REST helper ───────────────────────────────────────────────────────

class APIKeyError extends Error {
  constructor(msg = "GOOGLE_AI_API_KEY is not configured") {
    super(msg);
    this.name = "APIKeyError";
  }
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey.length < 10) throw new APIKeyError();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.2, 
        topP: 0.8, 
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            verdict: { type: "STRING" },
            accuracy: { type: "INTEGER" },
            points: { type: "ARRAY", items: { type: "STRING" } },
            biases: { type: "ARRAY", items: { type: "STRING" } },
            ragSources: { 
              type: "ARRAY", 
              items: { 
                type: "OBJECT",
                properties: {
                  url: { type: "STRING" },
                  title: { type: "STRING" },
                  supportsVerdict: { type: "BOOLEAN" }
                },
                required: ["url", "title", "supportsVerdict"]
              }
            }
          },
          required: ["summary", "verdict", "accuracy", "points", "biases"]
        }
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    if (res.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`Gemini API error ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json() as any;
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

// ─── Response validation ──────────────────────────────────────────────────────
// Now handled by VerificationResultSchema from shared/schema.ts

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(claim: string, sources: SourceInfo[], liveSources: SearchResult[]): string {
  const sourceList = sources.map(s => `• ${s.name} (${s.type})`).join("\n");
  const currentDate = new Date().toISOString().split("T")[0];
  
  const formattedLiveSources = liveSources.map((s, i) => `--- Source ${i+1} ---\nTitle: ${s.title}\nURL: ${s.url}\nContent: ${s.content}\n`).join("\n");

  return `You are an epistemically rigorous fact-verification system. Your job is to assess claims with calibrated confidence — never overstate certainty.
CURRENT SYSTEM DATE: ${currentDate}

CLAIM TO VERIFY:
"${claim}"

REFERENCE SOURCE CATEGORIES REQUESTED:
${sourceList}

LIVE WEB SOURCES FOUND FOR THIS CLAIM:
${formattedLiveSources}

ACCURACY CALIBRATION GUIDE (use this strictly):
- 80–100: Well-supported by multiple credible sources. Mainstream scientific/academic consensus.
- 60–79: Mostly true with some nuance, caveats, or context-dependence.
- 40–59: Disputed — conflicting evidence, or insufficient research, or contested by credible experts.
- 20–39: Mostly false or significantly misleading based on available evidence.
- 0–19: Demonstrably false or contradicted by strong evidence.

VERDICT OPTIONS (pick exactly one):
- "well-supported": 70+ accuracy, strong consensus
- "mostly-true": 60–79 accuracy, true with caveats
- "disputed": 40–59 accuracy, genuinely contested
- "likely-false": 20–39 accuracy, mostly incorrect
- "unverifiable": claim cannot be confirmed or denied with available evidence (set accuracy to 50)

RULES:
1. Base your assessment ONLY on the "LIVE WEB SOURCES FOUND" provided above. Do not fabricate citations or use external knowledge if it conflicts with the sources.
2. Be direct and precise. Avoid hedging language like "it may be" or "some say".
3. If the claim is ambiguous, state the specific interpretation you evaluated.
4. If the provided sources do not contain enough information to verify the claim, return a verdict of "unverifiable".
5. Identify real epistemic biases (confirmation bias risks, publication bias, etc.) — not vague disclaimers.

Respond with ONLY valid JSON — no markdown, no explanation outside the object:
{
  "summary": "2–3 sentence verdict with the core finding. State what is true, what is false, or why it's uncertain.",
  "verdict": "<one of the five verdict strings>",
  "accuracy": <integer 0–100>,
  "points": [
    "Specific, evidence-grounded point 1",
    "Specific, evidence-grounded point 2"
  ],
  "biases": [
    "Specific epistemic risk or limitation in evaluating this claim"
  ],
  "ragSources": [
    {
      "url": "<url of source used from the LIVE WEB SOURCES list>",
      "title": "<title of source used>",
      "supportsVerdict": <boolean true if it supports your verdict, false if it contradicts or is neutral>
    }
  ]
}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

const verify = async (req: Request, res: Response): Promise<Response> => {
  const { claim, sources } = req.body as VerificationRequest;

  // Input validation
  if (!claim || typeof claim !== "string" || claim.trim().length < 10) {
    return res.status(400).json({ message: "Claim must be at least 10 characters." });
  }
  if (!Array.isArray(sources) || sources.length === 0) {
    return res.status(400).json({ message: "Select at least one source category." });
  }

  // Collect selected sources
  const selectedSources: SourceInfo[] = sources.flatMap(
    (type) => SOURCE_REGISTRY[type] ?? []
  );

  if (selectedSources.length === 0) {
    return res.status(400).json({ message: "No valid source categories selected." });
  }

  try {
    console.log("[verify] Searching web for claim:", claim.trim());
    const liveSources = await searchWeb(claim.trim());
    
    if (liveSources.length === 0) {
      console.log("[verify] No live sources found from Tavily.");
      const fallbackResult = {
        summary: "Insufficient live sources found to verify this claim. The search yielded no relevant results.",
        verdict: "unverifiable" as const,
        accuracy: 50,
        points: ["No relevant articles or web pages were found via live search."],
        biases: ["Lack of data prevents any AI analysis."],
        sources: selectedSources,
        ragSources: []
      };
      
      const id = nanoid(10);
      await db.insert(verifications).values({
        id,
        claim: claim.trim(),
        verdict: fallbackResult.verdict,
        reasoning: fallbackResult.summary,
        accuracy: fallbackResult.accuracy,
        points: fallbackResult.points,
        biases: fallbackResult.biases,
        sources: selectedSources,
        ragSources: fallbackResult.ragSources,
      });
      
      return res.status(200).json({ id, ...fallbackResult });
    }

    const rawText = await callGemini(buildPrompt(claim.trim(), selectedSources, liveSources));

    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
      
    console.log("[verify] Cleaned text to parse:", cleaned);

    const parsed = JSON.parse(cleaned);
    const validatedData = VerificationResultSchema.parse(parsed);

    const fullResponse = { ...validatedData, sources: selectedSources };
    
    const id = nanoid(10);
    await db.insert(verifications).values({
      id,
      claim: claim.trim(),
      verdict: fullResponse.verdict,
      reasoning: fullResponse.summary,
      accuracy: fullResponse.accuracy,
      points: fullResponse.points,
      biases: fullResponse.biases,
      sources: fullResponse.sources,
      ragSources: fullResponse.ragSources ?? [],
    });

    return res.status(200).json({ id, ...fullResponse });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[verify] Error:', msg);

    if (msg === 'QUOTA_EXCEEDED') {
      return res.status(429).json({ 
        message: "The AI API has reached its daily free-tier quota. Please enable billing or wait until the quota resets." 
      });
    }

    return res.status(500).json({ 
      message: "The verification system encountered an error. Please try again in a moment." 
    });
  }
};

export default verify;
