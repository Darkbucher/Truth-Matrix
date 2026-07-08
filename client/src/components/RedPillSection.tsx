import { useState, useEffect, type FormEvent } from "react";
import { useVerificationContext } from "../contexts/VerificationContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight,
  ShieldAlert,
  Brain,
  Link as LinkIcon,
  Search,
  Share2,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SourceInfoType, VerdictType } from "../lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_CHARS = 500;

const SOURCE_LABELS: Record<string, string> = {
  academic:   "Academic",
  news:       "News",
  factCheck:  "Fact-Check",
  scientific: "Scientific",
};

const VERDICT_META: Record<
  VerdictType,
  { label: string; color: string; bg: string; darkColor: string; darkBg: string }
> = {
  "well-supported": {
    label: "Well-Supported",
    color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-400",
    darkColor: "dark:text-[#00FF41]", darkBg: "dark:bg-[#00FF41]/10 dark:border-[#00FF41]/60",
  },
  "mostly-true": {
    label: "Mostly True",
    color: "text-green-600", bg: "bg-green-50 border-green-400",
    darkColor: "dark:text-green-400", darkBg: "dark:bg-green-400/10 dark:border-green-400/60",
  },
  "disputed": {
    label: "Disputed",
    color: "text-amber-700", bg: "bg-amber-50 border-amber-400",
    darkColor: "dark:text-yellow-400", darkBg: "dark:bg-yellow-400/10 dark:border-yellow-400/60",
  },
  "likely-false": {
    label: "Likely False",
    color: "text-red-700", bg: "bg-red-50 border-red-400",
    darkColor: "dark:text-[#FF3333]", darkBg: "dark:bg-[#FF3333]/10 dark:border-[#FF3333]/60",
  },
  "unverifiable": {
    label: "Unverifiable",
    color: "text-gray-600", bg: "bg-gray-100 border-gray-400",
    darkColor: "dark:text-gray-400", darkBg: "dark:bg-gray-400/10 dark:border-gray-400/40",
  },
};

// ─── Accuracy Gauge ───────────────────────────────────────────────────────────

function AccuracyGauge({ value }: { value: number }) {
  const radius = 46;
  const stroke = 9;
  const normalised = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalised / 100) * circumference;

  const gaugeColor =
    normalised >= 70 ? "#00C851" :
    normalised >= 40 ? "#FFB300" : "#FF3333";

  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg
        width="144" height="144" viewBox="0 0 120 120"
        aria-label={`Accuracy gauge: ${normalised}%`}
        role="img"
      >
        {/* Track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-800"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease" }}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-bold font-mono"
          style={{ color: gaugeColor }}
        >
          {normalised}%
        </span>
        <span className="text-xs text-gray-400 mt-0.5">accuracy</span>
      </div>
    </div>
  );
}

// ─── Source URL Map ───────────────────────────────────────────────────────────

function getSearchUrl(sourceName: string, query: string): string {
  const q = encodeURIComponent(query);
  const map: Record<string, string> = {
    "Google Scholar": `https://scholar.google.com/scholar?q=${q}`,
    "JSTOR":          `https://www.jstor.org/action/doBasicSearch?Query=${q}`,
    "PubMed":         `https://pubmed.ncbi.nlm.nih.gov/?term=${q}`,
    "Reuters":        `https://www.reuters.com/search/news?blob=${q}`,
    "AP News":        `https://apnews.com/search?query=${q}`,
    "BBC News":       `https://www.bbc.co.uk/search?q=${q}`,
    "Snopes":         `https://www.snopes.com/search/?q=${q}`,
    "FactCheck.org":  `https://www.factcheck.org/search/?q=${q}`,
    "PolitiFact":     `https://www.politifact.com/search/?q=${q}`,
    "Nature":         `https://www.nature.com/search?q=${q}`,
    "Science.org":    `https://www.science.org/search?search_api_fulltext=${q}`,
    "arXiv":          `https://arxiv.org/search/?query=${q}&searchtype=all`,
  };
  return map[sourceName] ?? "#";
}

// ─── Source Card ──────────────────────────────────────────────────────────────

function SourceCard({ source, query }: { source: SourceInfoType; query: string }) {
  const fullStars = Math.floor(source.reliability / 2);

  return (
    <div
      className="rounded-lg border p-4 transition-all duration-300
                 hover:scale-[1.02] hover:-translate-y-0.5
                 dark:bg-black/80 bg-white/90
                 dark:border-[#00FF41]/60 border-emerald-400"
    >
      <h4 className="font-bold dark:text-white text-gray-900 mb-1">{source.name}</h4>
      <p className="text-xs dark:text-gray-400 text-gray-500 mb-3">{source.description}</p>
      <div className="flex justify-between items-center">
        <div aria-label={`Reliability: ${fullStars} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={i < fullStars
                ? "dark:text-[#00FF41] text-emerald-600"
                : "dark:text-gray-700 text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>
        <a
          href={getSearchUrl(source.name, query)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded
                     border transition-colors duration-200
                     dark:border-[#00FF41]/60 border-emerald-400
                     dark:text-white text-gray-800
                     dark:hover:bg-[#00FF41]/15 hover:bg-emerald-50"
        >
          Research <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const RedPillSection = () => {
  const { verifyInfo, verificationResult, isVerifying, error, lastClaim } =
    useVerificationContext();
  const { toast } = useToast();

  const [claim, setClaim] = useState("");
  const [sources, setSources] = useState({
    academic:   true,
    news:       true,
    factCheck:  true,
    scientific: true,
  });
  const [loadingText, setLoadingText] = useState("Searching live sources...");

  useEffect(() => {
    if (lastClaim && !claim) {
      setClaim(lastClaim);
    }
  }, [lastClaim]);

  useEffect(() => {
    if (!isVerifying) return;
    
    setLoadingText("Searching live sources...");
    
    const analyzeTimer = setTimeout(() => {
      setLoadingText("Analyzing evidence...");
    }, 3000);
    
    const finalizeTimer = setTimeout(() => {
      setLoadingText("Finalizing verdict...");
    }, 7000);
    
    return () => {
      clearTimeout(analyzeTimer);
      clearTimeout(finalizeTimer);
    };
  }, [isVerifying]);

  const remaining = MAX_CHARS - claim.length;
  const isOverLimit = remaining < 0;
  const tooShort = claim.trim().length > 0 && claim.trim().length < 10;
  const canSubmit = !isVerifying && claim.trim().length >= 10 && !isOverLimit;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const selected = Object.entries(sources)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (selected.length === 0) return;
    await verifyInfo(claim, selected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (canSubmit) handleSubmit(e as unknown as FormEvent);
    }
  };

  const groupedSources = () => {
    if (!verificationResult?.sources?.length) return {};
    return verificationResult.sources.reduce<Record<string, SourceInfoType[]>>(
      (acc, src) => {
        acc[src.type] = [...(acc[src.type] ?? []), src];
        return acc;
      },
      {}
    );
  };

  const verdict = verificationResult?.verdict
    ? VERDICT_META[verificationResult.verdict]
    : null;

  const handleShare = async () => {
    if (!verificationResult?.id) return;
    const url = `${window.location.origin}/verify/${verificationResult.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Shareable link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="redpill" className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3 dark:text-[#FF3333] text-red-600 red-text-shadow animate-glitch">
          Claim Verification
        </h2>
        <p className="text-lg mb-8 dark:text-gray-300 text-gray-700">
          Enter any claim or statement. Our AI cross-references it against
          multiple credible source categories and returns a calibrated accuracy
          assessment with transparent reasoning.
        </p>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-lg border
                       dark:border-[#FF3333] border-red-400
                       dark:bg-red-900/20 bg-red-50
                       dark:text-red-300 text-red-800 text-sm"
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Form Card */}
        <div
          className="rounded-xl border p-6 mb-8 backdrop-blur-sm
                     dark:bg-black/80 bg-white/95
                     dark:border-[#FF3333]/70 border-red-400"
        >
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Textarea */}
            <div>
              <label
                htmlFor="claim-input"
                className="block mb-2 font-medium dark:text-white text-gray-800"
              >
                Claim to verify
              </label>
              <Textarea
                id="claim-input"
                rows={3}
                maxLength={MAX_CHARS + 1}
                className="w-full px-4 py-2.5 font-mono text-sm resize-none
                           dark:bg-black/70 bg-gray-50
                           dark:text-white text-gray-900
                           dark:border-[#FF3333]/60 border-red-300 rounded-lg
                           focus:outline-none focus:ring-2
                           dark:focus:ring-[#FF3333]/60 focus:ring-red-400
                           transition-colors duration-200"
                placeholder='e.g. "The Great Wall of China is visible from space"'
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-describedby="char-count claim-hint"
                aria-invalid={isOverLimit || tooShort}
              />
              <div className="flex justify-between items-center mt-1.5 text-xs">
                <span id="claim-hint" className="dark:text-gray-500 text-gray-400">
                  {tooShort ? "⚠ Minimum 10 characters" : "Ctrl+Enter to submit"}
                </span>
                <span
                  id="char-count"
                  className={
                    isOverLimit
                      ? "text-red-500 font-semibold"
                      : remaining < 50
                      ? "dark:text-yellow-400 text-amber-600"
                      : "dark:text-gray-500 text-gray-400"
                  }
                >
                  {remaining < 0 ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`}
                </span>
              </div>
            </div>

            {/* Source Checkboxes */}
            <fieldset>
              <legend className="mb-2 font-medium dark:text-white text-gray-800">
                Source categories
              </legend>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {Object.entries(sources).map(([key, checked]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`src-${key}`}
                      checked={checked}
                      onCheckedChange={() =>
                        setSources((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                      }
                      className="w-4 h-4
                                 dark:border-[#FF3333]/70 border-red-400
                                 dark:data-[state=checked]:bg-[#FF3333] data-[state=checked]:bg-red-500
                                 dark:data-[state=checked]:border-[#FF3333] data-[state=checked]:border-red-500"
                    />
                    <label
                      htmlFor={`src-${key}`}
                      className="dark:text-gray-200 text-gray-700 text-sm cursor-pointer"
                    >
                      {SOURCE_LABELS[key]}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-lg border font-semibold tracking-wide
                         transition-all duration-200 hover:scale-[1.02] active:scale-95
                         dark:border-[#FF3333] border-red-500
                         dark:text-white text-gray-800
                         dark:bg-transparent bg-transparent
                         dark:hover:bg-[#FF3333]/20 hover:bg-red-50
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loadingText}
                </span>
              ) : (
                "Verify Claim"
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {verificationResult && (
          <div className="space-y-6 animate-fadeIn">

            {/* Summary Card */}
            <div
              className="rounded-xl border p-6 backdrop-blur-sm
                         dark:bg-black/80 bg-white/95
                         dark:border-[#FF3333]/70 border-red-300"
            >
              {/* Top Row: verdict badge + accuracy gauge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold dark:text-[#FF3333] text-red-600">
                      AI Verdict
                    </h3>
                    {verificationResult.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="h-7 text-xs flex items-center gap-1.5 dark:border-[#FF3333]/50 border-red-300 dark:hover:bg-[#FF3333]/20 hover:bg-red-50 dark:text-gray-300 text-gray-700"
                      >
                        <Share2 className="w-3 h-3" />
                        Share Link
                      </Button>
                    )}
                  </div>
                  {verdict && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border
                                  ${verdict.color} ${verdict.bg}
                                  ${verdict.darkColor} ${verdict.darkBg}`}
                    >
                      {verdict.label}
                    </span>
                  )}
                </div>
                <AccuracyGauge value={verificationResult.accuracy} />
              </div>

              {/* Summary */}
              <div className="rounded-lg p-4 mb-5 dark:bg-black/40 bg-gray-50">
                <p className="dark:text-gray-200 text-gray-800 leading-relaxed">
                  {verificationResult.summary}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-5">
                <h4 className="font-semibold dark:text-white text-gray-900 mb-3">
                  Key Findings
                </h4>
                <ul className="space-y-2" role="list">
                  {verificationResult.points.map((pt, i) => (
                    <li
                      key={i}
                      className="flex gap-2 dark:text-gray-200 text-gray-700 text-sm"
                    >
                      <span className="dark:text-[#00FF41] text-emerald-600 shrink-0 mt-0.5">→</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bias Indicators */}
              {verificationResult.biases.length > 0 && (
                <div>
                  <h4 className="font-semibold dark:text-white text-gray-900 mb-3 flex items-center gap-1.5">
                    <span className="text-amber-500" aria-hidden>⚠</span>
                    Epistemic Limitations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.biases.map((b, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full border
                                   dark:border-yellow-500/50 border-amber-300
                                   dark:bg-yellow-500/10 bg-amber-50
                                   dark:text-yellow-300 text-amber-800"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Source Grid */}
            <div>
              {verificationResult.ragSources && verificationResult.ragSources.length > 0 ? (
                <>
                  <h3 className="text-xl font-bold mb-4 dark:text-[#00FF41] text-emerald-700 flex items-center gap-2">
                    Live Web Sources
                    <span className="text-sm font-normal dark:text-gray-400 text-gray-500">
                      ({verificationResult.ragSources.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {verificationResult.ragSources.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-lg border p-4 transition-all duration-300
                                   dark:bg-black/80 bg-white/90
                                   dark:border-gray-700 border-gray-200"
                      >
                        <h4 className="font-bold dark:text-white text-gray-900 mb-2 truncate" title={src.title}>
                          {src.title}
                        </h4>
                        <div className="flex justify-between items-center mt-3">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded
                                       border transition-colors duration-200
                                       dark:border-gray-700 border-gray-300
                                       dark:text-gray-300 text-gray-700
                                       dark:hover:bg-gray-800 hover:bg-gray-100 truncate max-w-[60%]"
                            title={src.url}
                          >
                            <LinkIcon className="h-3 w-3 shrink-0" />
                            <span className="truncate">{new URL(src.url).hostname}</span>
                          </a>
                          <span className={`flex items-center gap-1 text-xs font-medium ${
                            src.supportsVerdict 
                              ? 'dark:text-[#00FF41] text-emerald-600' 
                              : 'dark:text-gray-500 text-gray-500'
                          }`}>
                            {src.supportsVerdict ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {src.supportsVerdict ? 'Supported' : 'Neutral/Disputed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4 dark:text-[#00FF41] text-emerald-700 flex items-center gap-2">
                    Requested Categories
                    <span className="text-sm font-normal dark:text-gray-400 text-gray-500">
                      ({verificationResult.sources.length})
                    </span>
                  </h3>
                  {Object.entries(groupedSources()).map(([type, list]) => (
                    <div key={type} className="mb-6">
                      <h4 className="text-sm font-semibold uppercase tracking-wider
                                     dark:text-gray-400 text-gray-500 mb-3">
                        {type === "fact-check" ? "Fact-Check" : type.charAt(0).toUpperCase() + type.slice(1)}
                        <span className="ml-1.5 font-normal normal-case">({list.length})</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {list.map((src, i) => (
                          <SourceCard key={i} source={src} query={lastClaim} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default RedPillSection;
