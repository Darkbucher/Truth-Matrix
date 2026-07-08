import { useRef } from "react";
import { useScrollReveal } from "../lib/hooks";
import { useVerificationContext } from "../contexts/VerificationContext";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Trash2 } from "lucide-react";
import { Link } from "wouter";
import type { HistoryItemType } from "../lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0)    return `${days}d ago`;
  if (hours > 0)   return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 70) return "dark:text-[#00FF41] text-emerald-700";
  if (accuracy >= 40) return "dark:text-yellow-400 text-amber-600";
  return "dark:text-[#FF3333] text-red-600";
}

function downloadAsJSON(history: HistoryItemType[]) {
  if (history.length === 0) return;
  const payload = JSON.stringify(
    history.map((item) => ({
      claim:     item.claim,
      timestamp: new Date(item.timestamp).toISOString(),
      verdict:   item.result.verdict,
      accuracy:  item.result.accuracy,
      summary:   item.result.summary,
      points:    item.result.points,
      biases:    item.result.biases,
      sources:   item.result.sources.map((s) => s.name),
    })),
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `truthmatrix-history-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Verdict badge colours ────────────────────────────────────────────────────

const VERDICT_COLORS: Record<string, string> = {
  "well-supported": "dark:text-[#00FF41] text-emerald-700",
  "mostly-true":    "dark:text-green-400 text-green-700",
  "disputed":       "dark:text-yellow-400 text-amber-600",
  "likely-false":   "dark:text-[#FF3333] text-red-600",
  "unverifiable":   "dark:text-gray-400 text-gray-500",
};

const VERDICT_LABELS: Record<string, string> = {
  "well-supported": "Well-Supported",
  "mostly-true":    "Mostly True",
  "disputed":       "Disputed",
  "likely-false":   "Likely False",
  "unverifiable":   "Unverifiable",
};

// ─── Component ────────────────────────────────────────────────────────────────

const HistorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { history, clearHistory } = useVerificationContext();

  return (
    <section id="history" className="min-h-screen py-16" ref={sectionRef}>
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 reveal">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-[#00FF41] text-emerald-700 matrix-text-shadow">
              Verification History
            </h2>
            <p className="mt-1 dark:text-gray-400 text-gray-600 text-sm">
              Stored locally in your browser · persists across sessions
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() => downloadAsJSON(history)}
                aria-label="Download history as JSON"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                           transition-all duration-200 hover:scale-[1.02] active:scale-95
                           dark:border-[#00FF41] border-emerald-500
                           dark:text-white text-gray-800
                           dark:bg-transparent bg-transparent
                           dark:hover:bg-[#00FF41]/15 hover:bg-emerald-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export JSON
              </Button>
              <Button
                onClick={clearHistory}
                aria-label="Clear all verification history"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                           transition-all duration-200 hover:scale-[1.02] active:scale-95
                           dark:border-red-700 border-red-400
                           dark:text-red-400 text-red-600
                           dark:bg-transparent bg-transparent
                           dark:hover:bg-red-900/20 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div
            className="rounded-xl border p-10 text-center reveal
                       dark:bg-black/80 bg-white/90
                       dark:border-[#00FF41]/40 border-emerald-300"
          >
            <div
              aria-hidden
              className="text-5xl mb-4 dark:text-[#00FF41]/40 text-emerald-300 select-none"
            >
              ≡
            </div>
            <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-2">
              No verifications yet
            </h3>
            <p className="dark:text-gray-400 text-gray-500 text-sm mb-5">
              Your verification history will appear here after you submit a claim.
            </p>
            <a
              href="#redpill"
              className="inline-block px-5 py-2 rounded-lg border text-sm font-medium
                         transition-all duration-200 hover:scale-[1.02]
                         dark:border-[#00FF41] border-emerald-500
                         dark:text-white text-gray-800
                         dark:hover:bg-[#00FF41]/15 hover:bg-emerald-50"
            >
              Start Verifying ↑
            </a>
          </div>
        ) : (
          <div className="space-y-3 reveal">
            {history.map((item, index) => (
              <Link key={`${item.id}-${index}`} href={`/verify/${item.id}`}>
                <div className="cursor-pointer">
                  <HistoryCard item={item} />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({ item }: { item: HistoryItemType }) {
  const verdictColor = VERDICT_COLORS[item.result.verdict] ?? "dark:text-gray-400 text-gray-500";
  const verdictLabel = VERDICT_LABELS[item.result.verdict] ?? item.result.verdict;
  const accuracyColor = getAccuracyColor(item.result.accuracy);

  return (
    <div
      className="rounded-xl border p-5 transition-all duration-300
                 dark:bg-black/80 bg-white/90
                 dark:border-[#00FF41]/40 border-emerald-200
                 dark:hover:border-[#00FF41]/80 hover:border-emerald-400"
    >
      {/* Claim */}
      <p
        className="font-semibold dark:text-white text-gray-900 mb-2 line-clamp-2 font-mono text-sm"
        title={item.claim}
      >
        "{item.claim}"
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-semibold ${verdictColor}`}>
            {verdictLabel}
          </span>
          <span className={`font-mono font-bold ${accuracyColor}`}>
            {item.result.accuracy}%
          </span>
        </div>
        <span className="dark:text-gray-500 text-gray-400">
          {getRelativeTime(item.timestamp)}
        </span>
      </div>

      {/* Summary preview */}
      {item.result.summary && (
        <p className="mt-2 text-xs dark:text-gray-400 text-gray-500 line-clamp-2 leading-relaxed">
          {item.result.summary}
        </p>
      )}
    </div>
  );
}

export default HistorySection;
