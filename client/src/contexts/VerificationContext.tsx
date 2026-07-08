import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import type {
  VerificationResultType,
  HistoryItemType,
} from "../lib/types";

const MAX_HISTORY = 20;

interface VerificationContextValue {
  verifyInfo: (claim: string, sources: string[]) => Promise<void>;
  verificationResult: VerificationResultType | null;
  isVerifying: boolean;
  error: string | null;
  history: HistoryItemType[];
  clearHistory: () => void;
  lastClaim: string;
  resetResult: () => void;
  loadVerification: (id: string) => Promise<void>;
}

const VerificationContext = createContext<VerificationContextValue | null>(null);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [verificationResult, setVerificationResult] =
    useState<VerificationResultType | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastClaim, setLastClaim] = useState("");
  const [history, setHistory] = useState<HistoryItemType[]>([]);

  // Fetch history from DB on mount
  useEffect(() => {
    fetch("/api/verifications")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then((data) => {
        const parsedHistory = data.map((item: any) => ({
          id: item.id,
          claim: item.claim,
          result: {
            summary: item.summary,
            verdict: item.verdict,
            accuracy: item.accuracy,
            points: item.points,
            biases: item.biases,
            sources: item.sources,
            ragSources: item.ragSources,
          },
          timestamp: new Date(item.createdAt).getTime(),
        }));
        setHistory(parsedHistory);
      })
      .catch((err) => console.error("Error loading history:", err));
  }, []);

  const verifyInfo = useCallback(async (claim: string, sources: string[]) => {
    setIsVerifying(true);
    setError(null);
    setLastClaim(claim);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, sources }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          (errData as { message?: string }).message ||
            `Server error: ${response.status}`
        );
      }

      const resultData = (await response.json()) as VerificationResultType & { id: string };

      if (resultData && typeof resultData === "object" && "sources" in resultData) {
        setVerificationResult(resultData);
        setHistory((prev) => {
          const item: HistoryItemType = {
            id: resultData.id,
            claim,
            result: resultData,
            timestamp: Date.now(),
          };
          return [item, ...prev].slice(0, MAX_HISTORY);
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const loadVerification = useCallback(async (id: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/verify/${id}`);
      if (!res.ok) {
        throw new Error("Verification not found");
      }
      const data = await res.json();
      setVerificationResult(data);
      setLastClaim(data.claim);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading verification");
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const resetResult = useCallback(() => {
    setVerificationResult(null);
    setError(null);
  }, []);

  return (
    <VerificationContext.Provider
      value={{
        verifyInfo,
        verificationResult,
        isVerifying,
        error,
        history,
        clearHistory,
        lastClaim,
        resetResult,
        loadVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerificationContext(): VerificationContextValue {
  const ctx = useContext(VerificationContext);
  if (!ctx) {
    throw new Error(
      "useVerificationContext must be used within a VerificationProvider"
    );
  }
  return ctx;
}
