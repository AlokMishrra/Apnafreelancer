import * as express from "express";
import { Router } from "express";
import { ServiceApplicationsStorage } from './service-applications-storage';
import { requireSupabaseAuth } from './supabase-auth';

// Create an Express router for the authenticated routes
const router = Router();

// Export the router as default for compatibility with existing imports
export default router;

export function setupServiceApplicationsRoutes(app: express.Express, storage: ServiceApplicationsStorage) {
  // API endpoint to apply to a service
  app.post("/api/services/:serviceId/apply", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      const { freelancerId, message, proposedPrice, deliveryTime } = req.body;
      
      if (!serviceId || !freelancerId || !message || !proposedPrice || !deliveryTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if the service exists
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Check if freelancer exists
      const freelancer = await storage.getUser(freelancerId);
      if (!freelancer) {
        return res.status(404).json({ error: "Freelancer not found" });
      }

      // Check if the freelancer has already applied to this service
      const existingApplication = await storage.getServiceApplicationByFreelancer(serviceId, freelancerId);
      if (existingApplication) {
        return res.status(400).json({ 
          error: "You have already applied to this service", 
          application: existingApplication 
        });
      }

      // Create the application
      const applicationData = {
        serviceId,
        freelancerId,
        message,
        proposedPrice,
        deliveryTime,
        status: "pending"
      };

      // Create the application in the database
      const application = await storage.createServiceApplication(applicationData);
      
      res.status(201).json(application);

    } catch (error) {
      console.error("Error applying to service:", error);
      res.status(500).json({ error: "Failed to apply to service" });
    }
  });

  // API endpoint to get applications for a service
  app.get("/api/services/:serviceId/applications", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      
      if (!serviceId) {
        return res.status(400).json({ error: "Missing service ID" });
      }

      // Check if the service exists
      const service = await storage.getService(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      // Get all applications for the service
      const applications = await storage.getServiceApplications(serviceId);
      
      res.status(200).json(applications);

    } catch (error) {
      console.error("Error getting service applications:", error);
      res.status(500).json({ error: "Failed to get service applications" });
    }
  });

  // API endpoint to get applications by a freelancer
  app.get("/api/freelancers/:freelancerId/applications", async (req, res) => {
    try {
      const { freelancerId } = req.params;
      
      if (!freelancerId) {
        return res.status(400).json({ error: "Missing freelancer ID" });
      }

      // Check if the freelancer exists
      const freelancer = await storage.getUser(freelancerId);
      if (!freelancer) {
        return res.status(404).json({ error: "Freelancer not found" });
      }
      
      // Get all applications by the freelancer
      const applications = await storage.getFreelancerApplications(freelancerId);
      
      res.status(200).json(applications);

    } catch (error) {
      console.error("Error getting freelancer applications:", error);
      res.status(500).json({ error: "Failed to get freelancer applications" });
    }
  });
  
  // Return the router in case it's needed elsewhere
  return router;
}