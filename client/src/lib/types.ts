// Core domain types for Truth-Matrix verification system

export type SourceInfoType = {
  name: string;
  type: string;
  description: string;
  reliability: number; // 1–10
};

export type VerdictType =
  | "well-supported"
  | "mostly-true"
  | "disputed"
  | "likely-false"
  | "unverifiable";

export type VerificationResultType = {
  id?: string;
  summary: string;
  verdict: VerdictType;
  accuracy: number; // 0–100, epistemically calibrated
  points: string[];
  biases: string[];
  sources: SourceInfoType[];
  ragSources?: {
    url: string;
    title: string;
    supportsVerdict: boolean;
  }[];
};

export type VerificationType = {
  claim: string;
  sources: string[];
};

export type HistoryItemType = {
  id: string;
  claim: string;
  result: VerificationResultType;
  timestamp: number;
};
