import type { Express } from "express";
import { createServer, type Server } from "http";
import verify from "./api/verify";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  app.post('/api/verify', verify);

  const httpServer = createServer(app);

  return httpServer;
}
