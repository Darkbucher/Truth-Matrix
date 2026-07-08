import fetch from "node-fetch";

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.error("[search] TAVILY_API_KEY is not set.");
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_raw_content: true,
        max_results: 3,
      }),
      signal: controller.signal as any,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      console.error(`[search] Tavily API error ${res.status}:`, err);
      return [];
    }

    const data = await res.json() as { results?: any[] };
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    // Extract title, url, and content (fallback to raw_content if content is empty)
    return data.results.map((r) => ({
      title: r.title || "Unknown Title",
      url: r.url || "",
      content: (r.raw_content || r.content || "").slice(0, 1500), // Cap at 1500 chars to save tokens
    }));
  } catch (err) {
    console.error("[search] Request failed or timed out:", err);
    return [];
  }
}
