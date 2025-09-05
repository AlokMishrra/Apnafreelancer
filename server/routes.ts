import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseStorage as storage } from "./supabase-storage";
import { requireSupabaseAuth, requireSupabaseAdmin, getCurrentSupabaseUser, type SupabaseAuthenticatedRequest } from "./supabase-auth";
import session from "express-session";
import { nanoid } from "nanoid";
import { 
  insertJobSchema, 
  insertServiceSchema, 
  insertProposalSchema, 
  insertMessageSchema,
  insertReviewSchema,
  insertHireRequestSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup secure session-based auth
  const sessionSecret = process.env.SESSION_SECRET || nanoid(32);
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    name: 'sessionId', // Don't use default connect.sid
  }));

  // Auth routes - Supabase handles registration/login on client side
  app.get('/api/auth/user', getCurrentSupabaseUser as any);

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
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

  app.post('/api/services', requireSupabaseAuth as any, async (req: SupabaseSupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
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
      // Only show approved jobs to public
      const jobs = await storage.getApprovedJobs();
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

  app.post('/api/jobs', requireSupabaseAuth as any, async (req: SupabaseSupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const jobData = insertJobSchema.parse({
        ...req.body,
        clientId: userId,
        status: "pending", // All new jobs require admin approval
      });
      const job = await storage.createJob(jobData);
      res.status(201).json({
        ...job,
        message: "Job submitted successfully! It will be reviewed by our team and published once approved."
      });
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
      const topFreelancers = await storage.getTopFreelancers();
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
  app.get('/api/jobs/:id/proposals', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const proposals = await storage.getProposalsForJob(jobId);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post('/api/proposals', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
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
  app.get('/api/conversations', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/messages/:userId', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const currentUserId = req.user!.id;
      const otherUserId = req.params.userId;
      const messages = await storage.getMessages(currentUserId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
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

  app.put('/api/messages/read/:userId', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const currentUserId = req.user!.id;
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

  app.post('/api/reviews', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
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

  // Admin routes
  app.get('/api/admin/pending-users', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const users = await storage.getPendingUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ message: "Failed to fetch pending users" });
    }
  });

  app.get('/api/admin/pending-services', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const services = await storage.getPendingServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching pending services:", error);
      res.status(500).json({ message: "Failed to fetch pending services" });
    }
  });

  app.get('/api/admin/pending-hire-requests', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const hireRequests = await storage.getPendingHireRequests();
      res.json(hireRequests);
    } catch (error) {
      console.error("Error fetching pending hire requests:", error);
      res.status(500).json({ message: "Failed to fetch pending hire requests" });
    }
  });

  app.get('/api/admin/pending-jobs', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const jobs = await storage.getPendingJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching pending jobs:", error);
      res.status(500).json({ message: "Failed to fetch pending jobs" });
    }
  });

  app.post('/api/admin/users/:id/approve', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.params.id;
      const adminId = req.user!.id;
      const user = await storage.approveUser(userId, adminId);
      res.json(user);
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ message: "Failed to approve user" });
    }
  });

  app.post('/api/admin/users/:id/reject', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.params.id;
      const adminId = req.user!.id;
      const user = await storage.rejectUser(userId, adminId);
      res.json(user);
    } catch (error) {
      console.error("Error rejecting user:", error);
      res.status(500).json({ message: "Failed to reject user" });
    }
  });

  app.post('/api/admin/services/:id/approve', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const service = await storage.approveService(serviceId, adminId);
      res.json(service);
    } catch (error) {
      console.error("Error approving service:", error);
      res.status(500).json({ message: "Failed to approve service" });
    }
  });

  app.post('/api/admin/services/:id/reject', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const { reason } = req.body;
      const service = await storage.rejectService(serviceId, adminId, reason);
      res.json(service);
    } catch (error) {
      console.error("Error rejecting service:", error);
      res.status(500).json({ message: "Failed to reject service" });
    }
  });

  app.post('/api/admin/hire-requests/:id/approve', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const hireRequestId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const hireRequest = await storage.approveHireRequest(hireRequestId, adminId);
      res.json(hireRequest);
    } catch (error) {
      console.error("Error approving hire request:", error);
      res.status(500).json({ message: "Failed to approve hire request" });
    }
  });

  app.post('/api/admin/jobs/:id/approve', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const job = await storage.approveJob(jobId, adminId);
      res.json(job);
    } catch (error) {
      console.error("Error approving job:", error);
      res.status(500).json({ message: "Failed to approve job" });
    }
  });

  app.post('/api/admin/hire-requests/:id/reject', requireSupabaseAdmin as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const hireRequestId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const { response } = req.body;
      const hireRequest = await storage.rejectHireRequest(hireRequestId, adminId, response);
      res.json(hireRequest);
    } catch (error) {
      console.error("Error rejecting hire request:", error);
      res.status(500).json({ message: "Failed to reject hire request" });
    }
  });

  // Hire request routes
  app.post('/api/hire-requests', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const hireRequestData = insertHireRequestSchema.parse({
        ...req.body,
        clientId: userId,
      });
      const hireRequest = await storage.createHireRequest(hireRequestData);
      res.status(201).json(hireRequest);
    } catch (error) {
      console.error("Error creating hire request:", error);
      res.status(500).json({ message: "Failed to create hire request" });
    }
  });

  app.get('/api/hire-requests/client', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const clientId = req.user!.id;
      const hireRequests = await storage.getHireRequestsByClient(clientId);
      res.json(hireRequests);
    } catch (error) {
      console.error("Error fetching hire requests:", error);
      res.status(500).json({ message: "Failed to fetch hire requests" });
    }
  });

  app.get('/api/hire-requests/freelancer', requireSupabaseAuth as any, async (req: SupabaseAuthenticatedRequest, res) => {
    try {
      const freelancerId = req.user!.id;
      const hireRequests = await storage.getHireRequestsByFreelancer(freelancerId);
      res.json(hireRequests);
    } catch (error) {
      console.error("Error fetching hire requests:", error);
      res.status(500).json({ message: "Failed to fetch hire requests" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
