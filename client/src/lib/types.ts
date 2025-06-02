// Types for the verification system

export type VerificationType = {
  claim: string;
  sources: string[];
  comfortSettings: ComfortSettingsType;
};

export type SourceInfoType = {
  name: string;
  type: string;
  description: string;
  reliability: number; // 1-10
};

export type VerificationResultType = {
  summary: string;
  accuracy: number; // 0-100%
  points: string[];
  biases: string[];
  sources: SourceInfoType[];
};

export type ComfortSettingsType = {
  comfortLevel: number; // 0-100
  challengingOpinions: boolean;
  controversialTopics: boolean;
  biasIndicators: boolean;
  sourceDiversity: boolean;
};

export type HistoryItemType = {
  claim: string;
  result: VerificationResultType;
  timestamp: number;
};
