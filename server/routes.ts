import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertJobSchema, 
  insertServiceSchema, 
  insertProposalSchema, 
  insertMessageSchema,
  insertReviewSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Return mock user data for now
      const user = {
        id: req.user.claims.sub,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
      };
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      // Mock categories data
      const categories = [
        { id: 1, name: "Web Development", description: "Frontend and backend development" },
        { id: 2, name: "Mobile Development", description: "iOS and Android apps" },
        { id: 3, name: "Design", description: "UI/UX and graphic design" },
        { id: 4, name: "Writing", description: "Content and copywriting" },
        { id: 5, name: "Marketing", description: "Digital marketing and SEO" }
      ];
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      // Mock services data
      const services = [
        {
          id: 1,
          title: "Professional Website Development",
          description: "Custom website development with modern technologies",
          price: 500,
          categoryId: 1,
          freelancerId: "freelancer-1",
          freelancer: {
            id: "freelancer-1",
            firstName: "John",
            lastName: "Smith",
            profileImageUrl: null
          }
        }
      ];
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        freelancerId: userId,
      });
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Job routes
  app.get('/api/jobs', async (req, res) => {
    try {
      // Mock jobs data
      const jobs = [
        {
          id: 1,
          title: "Need a React Website",
          description: "Looking for a developer to build a modern React website",
          budget: 1000,
          categoryId: 1,
          clientId: "client-1",
          status: "open",
          createdAt: new Date(),
          client: {
            id: "client-1",
            firstName: "Jane",
            lastName: "Doe",
            profileImageUrl: null
          }
        }
      ];
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobData = insertJobSchema.parse({
        ...req.body,
        clientId: userId,
      });
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Freelancer routes
  app.get('/api/freelancers', async (req, res) => {
    try {
      // Mock freelancers data
      const freelancers = [
        {
          id: "freelancer-1",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
          profileImageUrl: null,
          title: "Full Stack Developer",
          bio: "Experienced web developer with 5+ years of experience in React and Node.js",
          hourlyRate: 75,
          rating: 4.8,
          totalJobs: 45,
          skills: ["React", "Node.js", "TypeScript", "MongoDB"],
          location: "San Francisco, CA",
          createdAt: new Date()
        },
        {
          id: "freelancer-2",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
          profileImageUrl: null,
          title: "UI/UX Designer",
          bio: "Creative designer specializing in modern web and mobile interfaces",
          hourlyRate: 65,
          rating: 4.9,
          totalJobs: 32,
          skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
          location: "New York, NY",
          createdAt: new Date()
        },
        {
          id: "freelancer-3",
          firstName: "Mike",
          lastName: "Chen",
          email: "mike.chen@example.com",
          profileImageUrl: null,
          title: "Mobile Developer",
          bio: "Expert in iOS and Android app development",
          hourlyRate: 80,
          rating: 4.7,
          totalJobs: 28,
          skills: ["Swift", "Kotlin", "React Native", "Flutter"],
          location: "Seattle, WA",
          createdAt: new Date()
        }
      ];
      res.json(freelancers);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      res.status(500).json({ message: "Failed to fetch freelancers" });
    }
  });

  app.get('/api/freelancers/top', async (req, res) => {
    try {
      // Mock top freelancers data
      const topFreelancers = [
        {
          id: "freelancer-1",
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
          profileImageUrl: null,
          title: "Full Stack Developer",
          bio: "Experienced web developer with 5+ years of experience in React and Node.js",
          hourlyRate: 75,
          rating: 4.9,
          totalJobs: 45,
          skills: ["React", "Node.js", "TypeScript", "MongoDB"],
          location: "San Francisco, CA",
          createdAt: new Date()
        },
        {
          id: "freelancer-2",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
          profileImageUrl: null,
          title: "UI/UX Designer",
          bio: "Creative designer specializing in modern web and mobile interfaces",
          hourlyRate: 65,
          rating: 4.8,
          totalJobs: 32,
          skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
          location: "New York, NY",
          createdAt: new Date()
        },
        {
          id: "freelancer-3",
          firstName: "Mike",
          lastName: "Chen",
          email: "mike.chen@example.com",
          profileImageUrl: null,
          title: "Mobile Developer",
          bio: "Expert in iOS and Android app development",
          hourlyRate: 80,
          rating: 4.7,
          totalJobs: 28,
          skills: ["Swift", "Kotlin", "React Native", "Flutter"],
          location: "Seattle, WA",
          createdAt: new Date()
        }
      ];
      res.json(topFreelancers);
    } catch (error) {
      console.error("Error fetching top freelancers:", error);
      res.status(500).json({ message: "Failed to fetch top freelancers" });
    }
  });

  // Individual user/freelancer routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Services by freelancer route
  app.get('/api/services/by-freelancer/:id', async (req, res) => {
    try {
      const freelancerId = req.params.id;
      const services = await storage.getServicesByFreelancer(freelancerId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services by freelancer:", error);
      res.status(500).json({ message: "Failed to fetch services by freelancer" });
    }
  });

  // Proposal routes
  app.get('/api/jobs/:id/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const proposals = await storage.getProposalsForJob(jobId);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post('/api/proposals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const proposalData = insertProposalSchema.parse({
        ...req.body,
        freelancerId: userId,
      });
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  // Message routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/messages/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      const messages = await storage.getMessages(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.put('/api/messages/read/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      await storage.markMessagesAsRead(otherUserId, currentUserId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  // Review routes
  app.get('/api/users/:id/reviews', async (req, res) => {
    try {
      const userId = req.params.id;
      const reviews = await storage.getReviewsForUser(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: userId,
      });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
