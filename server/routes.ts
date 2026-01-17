import express, { type Express } from "express";
import { registerAuthRoutes, setupAuth } from "./replit_integrations/auth";

export async function registerRoutes(app: Express) {
  // Set up authentication first
  await setupAuth(app);
  registerAuthRoutes(app);

  // API routes can be added here
  
  return app;
}
