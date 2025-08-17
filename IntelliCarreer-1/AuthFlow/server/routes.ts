import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth"; // <-- comment this

import { 
  insertUserProfileSchema, 
  insertAssessmentSchema, 
  insertUserSkillSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // await setupAuth(app); // <-- comment this

  // Auth routes
  // You have to comment `isAuthenticated` here OR replace with a placeholder middleware
  // Example placeholder middleware (allows all requests)
  const isAuthenticated: any = (req: any, res: any, next: any) => next();

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub; // Optional chaining since no real auth now
      const user = await storage.getUser(userId);
      const profile = await storage.getUserProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const existingProfile = await storage.getUserProfile(userId);
      let profile;
      
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, profileData);
      } else {
        profile = await storage.createUserProfile(profileData);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      res.status(400).json({ message: "Failed to save profile" });
    }
  });

  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // ... rest of your routes remain the same, just replace req.user.claims.sub with optional chaining
  // e.g., req.user?.claims?.sub
  // and keep `isAuthenticated` as the placeholder above

  const httpServer = createServer(app);
  return httpServer;
}
