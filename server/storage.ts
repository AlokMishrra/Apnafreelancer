import {
  users,
  categories,
  services,
  jobs,
  proposals,
  messages,
  reviews,
  hireRequests,
  adminActions,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Service,
  type InsertService,
  type Job,
  type InsertJob,
  type Proposal,
  type InsertProposal,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type HireRequest,
  type InsertHireRequest,
  type AdminAction,
  type InsertAdminAction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Service operations
  getServices(categoryId?: number, search?: string): Promise<Service[]>;
  getServicesByFreelancer(freelancerId: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  
  // Job operations
  getJobs(categoryId?: number, search?: string): Promise<Job[]>;
  getApprovedJobs(categoryId?: number, search?: string): Promise<Job[]>;
  getJobsByClient(clientId: string): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  
  // Freelancer operations
  getFreelancers(categoryId?: number, search?: string): Promise<User[]>;
  getTopFreelancers(limit?: number): Promise<User[]>;
  
  // Proposal operations
  getProposalsForJob(jobId: number): Promise<Proposal[]>;
  getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal>;
  
  // Message operations
  getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]>;
  getMessages(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
  
  // Review operations
  getReviewsForUser(userId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Admin operations
  getPendingUsers(): Promise<User[]>;
  getPendingServices(): Promise<Service[]>;
  getPendingJobs(): Promise<Job[]>;
  getPendingHireRequests(): Promise<HireRequest[]>;
  approveUser(userId: string, adminId: string): Promise<User>;
  rejectUser(userId: string, adminId: string): Promise<User>;
  approveService(serviceId: number, adminId: string): Promise<Service>;
  rejectService(serviceId: number, adminId: string, reason?: string): Promise<Service>;
  approveJob(jobId: number, adminId: string): Promise<Job>;
  approveHireRequest(hireRequestId: number, adminId: string): Promise<HireRequest>;
  rejectHireRequest(hireRequestId: number, adminId: string, response?: string): Promise<HireRequest>;
  createAdminAction(action: InsertAdminAction): Promise<AdminAction>;
  
  // Hire request operations
  createHireRequest(hireRequest: InsertHireRequest): Promise<HireRequest>;
  getHireRequestsByClient(clientId: string): Promise<HireRequest[]>;
  getHireRequestsByFreelancer(freelancerId: string): Promise<HireRequest[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Service operations
  async getServices(categoryId?: number, search?: string): Promise<Service[]> {
    let conditions = [eq(services.isActive, true), eq(services.status, "approved")];
    
    if (categoryId) {
      conditions.push(eq(services.categoryId, categoryId));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(services.title, `%${search}%`),
          ilike(services.description, `%${search}%`)
        )!
      );
    }
    
    return await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(desc(services.createdAt));
  }

  async getServicesByFreelancer(freelancerId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.freelancerId, freelancerId), eq(services.isActive, true), eq(services.status, "approved")))
      .orderBy(desc(services.createdAt));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  // Job operations
  async getJobs(categoryId?: number, search?: string): Promise<Job[]> {
    let conditions = [eq(jobs.status, "open")];
    
    if (categoryId) {
      conditions.push(eq(jobs.categoryId, categoryId));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.description, `%${search}%`)
        )!
      );
    }
    
    return await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt));
  }

  async getApprovedJobs(categoryId?: number, search?: string): Promise<Job[]> {
    let conditions = [eq(jobs.status, "open")]; // "open" status means approved and active
    
    if (categoryId) {
      conditions.push(eq(jobs.categoryId, categoryId));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.description, `%${search}%`)
        )!
      );
    }
    
    return await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt));
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.clientId, clientId))
      .orderBy(desc(jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db
      .insert(jobs)
      .values(job)
      .returning();
    return newJob;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }

  // Freelancer operations
  async getFreelancers(categoryId?: number, search?: string): Promise<User[]> {
    let conditions = [eq(users.isFreelancer, true), eq(users.status, "approved")];
    
    if (search) {
      conditions.push(
        or(
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
          ilike(users.bio, `%${search}%`)
        )!
      );
    }
    
    return await db
      .select()
      .from(users)
      .where(and(...conditions))
      .orderBy(desc(users.rating));
  }

  async getTopFreelancers(limit: number = 8): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.isFreelancer, true), eq(users.status, "approved")))
      .orderBy(desc(users.rating))
      .limit(limit);
  }

  // Proposal operations
  async getProposalsForJob(jobId: number): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.jobId, jobId))
      .orderBy(desc(proposals.createdAt));
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.freelancerId, freelancerId))
      .orderBy(desc(proposals.createdAt));
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [newProposal] = await db
      .insert(proposals)
      .values(proposal)
      .returning();
    return newProposal;
  }

  async updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal> {
    const [updatedProposal] = await db
      .update(proposals)
      .set(proposal)
      .where(eq(proposals.id, id))
      .returning();
    return updatedProposal;
  }

  // Message operations
  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]> {
    // Get distinct conversations with last message
    const conversations = await db
      .select({
        otherUserId: 
          sql`CASE 
            WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
            ELSE ${messages.senderId}
          END`.as('other_user_id'),
        lastMessageContent: messages.content,
        lastMessageTime: messages.createdAt,
        isRead: messages.isRead,
        senderId: messages.senderId,
      })
      .from(messages)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));

    // Get unique conversations
    const uniqueConversations = new Map();
    for (const conv of conversations) {
      if (!uniqueConversations.has(conv.otherUserId)) {
        uniqueConversations.set(conv.otherUserId, conv);
      }
    }

    // Get user details for each conversation
    const result = [];
    for (const [otherUserId, conv] of Array.from(uniqueConversations)) {
      const [user] = await db.select().from(users).where(eq(users.id, otherUserId));
      if (user) {
        result.push({
          user,
          lastMessage: {
            id: 0,
            senderId: conv.senderId,
            receiverId: conv.otherUserId,
            content: conv.lastMessageContent,
            isRead: conv.isRead,
            createdAt: conv.lastMessageTime,
          } as Message,
        });
      }
    }

    return result;
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.senderId, senderId),
          eq(messages.receiverId, receiverId),
          eq(messages.isRead, false)
        )
      );
  }

  // Review operations
  async getReviewsForUser(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Admin operations
  async getPendingUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(eq(users.status, "pending"), eq(users.isAdmin, false)))
      .orderBy(desc(users.createdAt));
  }

  async getPendingServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.status, "pending"))
      .orderBy(desc(services.createdAt));
  }

  async getPendingJobs(): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "pending"))
      .orderBy(desc(jobs.createdAt));
  }

  async getPendingHireRequests(): Promise<HireRequest[]> {
    return await db
      .select()
      .from(hireRequests)
      .where(eq(hireRequests.status, "pending"))
      .orderBy(desc(hireRequests.createdAt));
  }

  async approveUser(userId: string, adminId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        status: "approved", 
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "approve_user",
      targetType: "user",
      targetId: userId,
      details: "User approved"
    });

    return user;
  }

  async rejectUser(userId: string, adminId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        status: "rejected", 
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "reject_user",
      targetType: "user",
      targetId: userId,
      details: "User rejected"
    });

    return user;
  }

  async approveService(serviceId: number, adminId: string): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ 
        status: "approved", 
        isActive: true,
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(services.id, serviceId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "approve_service",
      targetType: "service",
      targetId: serviceId.toString(),
      details: "Service approved and made active"
    });

    return service;
  }

  async rejectService(serviceId: number, adminId: string, reason?: string): Promise<Service> {
    const [service] = await db
      .update(services)
      .set({ 
        status: "rejected", 
        isActive: false,
        rejectionReason: reason,
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(services.id, serviceId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "reject_service",
      targetType: "service",
      targetId: serviceId.toString(),
      details: `Service rejected${reason ? `: ${reason}` : ""}`
    });

    return service;
  }

  async approveJob(jobId: number, adminId: string): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set({ 
        status: "open", 
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(jobs.id, jobId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "approve_job",
      targetType: "job",
      targetId: jobId.toString(),
      details: "Job approved and opened"
    });

    return job;
  }

  async approveHireRequest(hireRequestId: number, adminId: string): Promise<HireRequest> {
    const [hireRequest] = await db
      .update(hireRequests)
      .set({ 
        status: "approved", 
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(hireRequests.id, hireRequestId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "approve_hire_request",
      targetType: "hire_request",
      targetId: hireRequestId.toString(),
      details: "Hire request approved"
    });

    return hireRequest;
  }

  async rejectHireRequest(hireRequestId: number, adminId: string, response?: string): Promise<HireRequest> {
    const [hireRequest] = await db
      .update(hireRequests)
      .set({ 
        status: "rejected", 
        adminResponse: response,
        approvedBy: adminId, 
        approvedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(hireRequests.id, hireRequestId))
      .returning();

    await this.createAdminAction({
      adminId,
      action: "reject_hire_request",
      targetType: "hire_request",
      targetId: hireRequestId.toString(),
      details: `Hire request rejected${response ? `: ${response}` : ""}`
    });

    return hireRequest;
  }

  async createAdminAction(action: InsertAdminAction): Promise<AdminAction> {
    const [newAction] = await db
      .insert(adminActions)
      .values(action)
      .returning();
    return newAction;
  }

  // Hire request operations
  async createHireRequest(hireRequest: InsertHireRequest): Promise<HireRequest> {
    const [newHireRequest] = await db
      .insert(hireRequests)
      .values(hireRequest)
      .returning();
    return newHireRequest;
  }

  async getHireRequestsByClient(clientId: string): Promise<HireRequest[]> {
    return await db
      .select()
      .from(hireRequests)
      .where(eq(hireRequests.clientId, clientId))
      .orderBy(desc(hireRequests.createdAt));
  }

  async getHireRequestsByFreelancer(freelancerId: string): Promise<HireRequest[]> {
    return await db
      .select()
      .from(hireRequests)
      .where(eq(hireRequests.freelancerId, freelancerId))
      .orderBy(desc(hireRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
