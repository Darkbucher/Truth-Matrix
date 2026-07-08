import type { Express } from "express";
import { createServer, type Server } from "http";
import verify from "./api/verify";

import { db } from "./db";
import { verifications } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  app.post('/api/verify', verify);

  app.get('/api/verify/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.select().from(verifications).where(eq(verifications.id, id));
      
      if (!result) {
        return res.status(404).json({ message: "Verification not found" });
      }
      
      // Map reasoning back to summary to match frontend schema
      return res.status(200).json({ ...result, summary: result.reasoning });
    } catch (error) {
      console.error("[get-verify]", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get('/api/verifications', async (req, res) => {
    try {
      // Get recent 20 verifications
      const results = await db.select()
        .from(verifications)
        .orderBy(desc(verifications.createdAt))
        .limit(20);
      
      const mapped = results.map(r => ({ ...r, summary: r.reasoning }));
      return res.status(200).json(mapped);
    } catch (error) {
      console.error("[get-verifications]", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
