import { pgTable, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  claim: text("claim").notNull(),
  verdict: text("verdict").notNull(),
  reasoning: text("reasoning").notNull(),
  accuracy: integer("accuracy").notNull(),
  points: jsonb("points").notNull(),
  biases: jsonb("biases").notNull(),
  sources: jsonb("sources").notNull(),
  ragSources: jsonb("ragSources").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const VerificationResultSchema = z.object({
  summary: z.string(),
  verdict: z.enum(["well-supported", "mostly-true", "disputed", "likely-false", "unverifiable"]),
  accuracy: z.number().min(0).max(100),
  points: z.array(z.string()),
  biases: z.array(z.string()),
  ragSources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    supportsVerdict: z.boolean()
  })).optional()
});

export type VerificationResult = z.infer<typeof VerificationResultSchema>;
