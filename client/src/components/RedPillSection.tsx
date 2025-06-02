import { useState, FormEvent } from "react";
import { useVerification } from "../lib/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { SourceInfoType, VerificationResultType } from "../lib/types";

// 🔗 URL mapping function
const getSearchUrl = (sourceName: string, query: string): string => {
  const q = encodeURIComponent(query);
  switch (sourceName) {
    case "Google Scholar":
      return `https://scholar.google.com/scholar?q=${q}`;
    case "JSTOR":
      return `https://www.jstor.org/action/doBasicSearch?Query=${q}`;
    case "PubMed":
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${q}`;
    case "Reuters":
      return `https://www.reuters.com/search/news?blob=${q}`;
    case "AP News":
      return `https://apnews.com/search?query=${q}`;
    case "BBC News":
      return `https://www.bbc.co.uk/search?q=${q}`;
    case "Snopes":
      return `https://www.snopes.com/search/?q=${q}`;
    case "FactCheck.org":
      return `https://www.factcheck.org/search/?q=${q}`;
    case "PolitiFact":
      return `https://www.politifact.com/search/?q=${q}`;
    case "Nature":
      return `https://www.nature.com/search?q=${q}`;
    case "Science.org":
      return `https://www.science.org/search?search_api_fulltext=${q}`;
    case "arXiv":
      return `https://arxiv.org/search/?query=${q}&searchtype=all`;
    default:
      return "#";
  }
};

// 🔍 Updated SourceCard with real search links
const SourceCard = ({
  source,
  query,
}: {
  source: SourceInfoType;
  query: string;
}) => {
  const fullStars = Math.floor(source.reliability / 2);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < fullStars ? (
      <span key={i} className="dark:text-[#00FF41] light:text-emerald-500">
        ★
      </span>
    ) : (
      <span key={i} className="dark:text-gray-600 light:text-gray-400">
        ★
      </span>
    ),
  );

  const searchUrl = getSearchUrl(source.name, query);

  return (
    <div className="matrix-card dark:bg-black/80 light:bg-white/90 p-4 rounded-lg 
                  dark:border-[#00FF41] light:border-emerald-500 matrix-box-shadow
                  transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
      <h4 className="font-bold dark:text-white light:text-gray-800 mb-1">{source.name}</h4>
      <p className="text-sm dark:text-gray-400 light:text-gray-500 mb-2">{source.description}</p>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs dark:text-white light:text-gray-800 mr-2">Reliability:</span>
          <span className="text-xs">{stars}</span>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="matrix-button text-xs px-2 py-1 rounded flex items-center
                   dark:border-[#00FF41] light:border-emerald-500 
                   dark:text-white light:text-gray-800 
                   dark:hover:bg-[#00FF41]/20 light:hover:bg-emerald-500/20"
        >
          View Results <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

const RedPillSection = () => {
  const { verifyInfo, verificationResult, isVerifying, error } = useVerification();
  const [claim, setClaim] = useState("");
  const [sources, setSources] = useState({
    academic: true,
    news: true,
    factCheck: true,
    scientific: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    const selected = Object.entries(sources)
      .filter(([, sel]) => sel)
      .map(([name]) => name);

    await verifyInfo(claim, selected);
  };

  const toggleSource = (key: keyof typeof sources) => {
    setSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSourcesByType = () => {
    if (!verificationResult?.sources?.length) return null;
    const grouped: Record<string, SourceInfoType[]> = {};
    verificationResult.sources.forEach((src) => {
      grouped[src.type] = grouped[src.type] || [];
      grouped[src.type].push(src);
    });
    return Object.entries(grouped).map(([type, list]) => (
      <div key={type} className="mt-6">
        <h3 className="text-xl font-bold mb-4 dark:text-[#00FF41] light:text-emerald-600 matrix-text-shadow capitalize
                      flex items-center">
          {type === "fact-check"
            ? "Fact-Check Sources"
            : `${type[0].toUpperCase() + type.slice(1)} Sources`}
          <span className="ml-2 text-sm font-normal dark:text-white/70 light:text-gray-600">
            ({list.length})
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {list.map((src, i) => (
            <SourceCard key={i} source={src} query={claim} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <section id="redpill" className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-[#FF0000] light:text-red-600 red-text-shadow animate-glitch">
          Red Pill: Truth Seeker
        </h2>
        <p className="text-lg mb-8 dark:text-white light:text-gray-800">
          Enter any claim or statement to verify against multiple trusted
          sources. Our AI-powered system will analyze and present unbiased
          results.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 text-red-800 font-semibold animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="matrix-card dark:bg-black/80 light:bg-white/95 p-6 rounded-lg 
                        dark:border-[#FF0000] light:border-red-500 red-box-shadow mb-8
                        backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="claim" className="block mb-2 dark:text-white light:text-gray-800 font-medium">
                Enter a claim to verify:
              </label>
              <Textarea
                id="claim"
                rows={3}
                className="w-full px-4 py-2 dark:bg-black/70 light:bg-gray-50
                          dark:text-white light:text-gray-800
                          dark:border-[#FF0000] light:border-red-500 rounded-lg
                          focus:outline-none focus:ring-2 dark:focus:ring-[#FF0000] light:focus:ring-red-500
                          transition-colors duration-300"
                placeholder="e.g., 'Climate change is real'"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-6 py-2">
              {Object.entries(sources).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-3 transition-transform hover:scale-105">
                  <Checkbox
                    id={`${key}Sources`}
                    checked={checked}
                    onCheckedChange={() =>
                      toggleSource(key as keyof typeof sources)
                    }
                    className="w-5 h-5 dark:border-[#FF0000] light:border-red-500 
                              dark:text-[#FF0000] light:text-red-500 
                              dark:bg-black light:bg-white 
                              dark:data-[state=checked]:bg-[#FF0000] light:data-[state=checked]:bg-red-500 
                              dark:data-[state=checked]:text-white light:data-[state=checked]:text-white"
                  />
                  <label htmlFor={`${key}Sources`} className="dark:text-white light:text-gray-800 font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isVerifying || !claim.trim()}
              className="red-pill-button px-6 py-3 mt-2 rounded-lg transition-all duration-300
                        text-lg font-medium dark:text-white light:text-gray-800
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:scale-105 active:scale-95"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "VERIFY NOW"
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {verificationResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* AI Summary */}
            <div className="matrix-card dark:bg-black/80 light:bg-white/95 p-6 rounded-lg 
                           dark:border-[#FF0000] light:border-red-500 red-box-shadow
                           backdrop-blur-sm transition-all duration-300">
              <div className="md:flex justify-between items-start mb-4">
                <h3 className="text-xl md:text-2xl font-bold dark:text-[#FF0000] light:text-red-600 mb-2 md:mb-0">
                  AI-Generated Summary
                </h3>
                <div className="inline-flex px-4 py-2 dark:bg-black/60 light:bg-gray-100 
                               dark:border-[#FF0000] light:border-red-500 border rounded-md 
                               dark:text-white light:text-gray-800 text-sm font-medium">
                  Accuracy: <span className="ml-1 font-bold">{verificationResult.accuracy}%</span>
                </div>
              </div>
              
              <div className="dark:bg-black/40 light:bg-white/70 p-4 rounded-md mb-6">
                <p className="dark:text-white light:text-gray-800 mb-4 text-lg">{verificationResult.summary}</p>
              </div>
              
              <h4 className="text-lg font-bold mb-3 dark:text-white light:text-gray-800">Key Points:</h4>
              <ul className="list-disc list-inside space-y-3 dark:text-white light:text-gray-800 ml-4">
                {verificationResult.points.map((pt, i) => (
                  <li key={i} className="relative pl-2">
                    <span className="dark:text-green-400 light:text-green-600 absolute -left-4 top-0">→</span>
                    {pt}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="text-lg font-bold mb-3 dark:text-white light:text-gray-800 flex items-center">
                  <span className="dark:text-yellow-400 light:text-amber-500 mr-2">⚠</span>
                  Potential Biases Detected:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {verificationResult.biases.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 dark:bg-black/80 light:bg-gray-100 
                                dark:text-white light:text-gray-800 
                                dark:border-[#FF0000] light:border-red-500 border 
                                rounded-full text-sm hover:scale-105 transition-transform"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold dark:text-[#00FF41] light:text-emerald-600 matrix-text-shadow
                            flex items-center space-x-2">
                <span>Sources Analyzed</span>
                <span className="text-sm ml-2 dark:text-white/70 light:text-gray-600">
                  ({verificationResult.sources?.length || 0})
                </span>
              </h3>
              
              <div className="dark:bg-black/30 light:bg-gray-50/80 backdrop-blur-sm p-4 rounded-lg">
                {renderSourcesByType()}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RedPillSection;
