import { supabase } from './db';
import {
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

export interface IStorage {
  // User operations
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

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as User;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw new Error(error.message);
    return data as Category[];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Category;
  }

  // Service operations
  async getServices(categoryId?: number, search?: string): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'approved');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Service[];
  }

  async getServicesByFreelancer(freelancerId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .eq('is_active', true)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Service[];
  }

  async getService(id: number): Promise<Service | undefined> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Service;
  }

  async createService(service: InsertService): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Service;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...service, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Service;
  }

  // Job operations
  async getJobs(categoryId?: number, search?: string): Promise<Job[]> {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Job[];
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Job[];
  }

  async getJob(id: number): Promise<Job | undefined> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Job;
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...job, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Job;
  }

  // Freelancer operations
  async getFreelancers(categoryId?: number, search?: string): Promise<User[]> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('is_freelancer', true)
      .eq('status', 'approved');

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as User[];
  }

  async getTopFreelancers(limit: number = 8): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_freelancer', true)
      .eq('status', 'approved')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) throw new Error(error.message);
    return data as User[];
  }

  // Proposal operations
  async getProposalsForJob(jobId: number): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Proposal[];
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Proposal[];
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Proposal;
  }

  async updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .update(proposal)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Proposal;
  }

  // Message operations
  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]> {
    // This is a simplified implementation - you might want to optimize this
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const conversations = new Map();
    for (const message of messages as Message[]) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, message);
      }
    }

    const result = [];
    for (const [otherUserId, lastMessage] of conversations) {
      const user = await this.getUser(otherUserId);
      if (user) {
        result.push({ user, lastMessage });
      }
    }

    return result;
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at');
    
    if (error) throw new Error(error.message);
    return data as Message[];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Message;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);
    
    if (error) throw new Error(error.message);
  }

  // Review operations
  async getReviewsForUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Review[];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Review;
  }

  // Admin operations
  async getPendingUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending')
      .eq('is_admin', false)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as User[];
  }

  async getPendingServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Service[];
  }

  async getPendingJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Job[];
  }

  async getPendingHireRequests(): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as HireRequest[];
  }

  async approveUser(userId: string, adminId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        status: 'approved', 
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'approve_user',
      targetType: 'user',
      targetId: userId,
      details: 'User approved'
    });

    return data as User;
  }

  async rejectUser(userId: string, adminId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        status: 'rejected', 
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'reject_user',
      targetType: 'user',
      targetId: userId,
      details: 'User rejected'
    });

    return data as User;
  }

  async approveService(serviceId: number, adminId: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ 
        status: 'approved', 
        is_active: true,
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'approve_service',
      targetType: 'service',
      targetId: serviceId.toString(),
      details: 'Service approved and made active'
    });

    return data as Service;
  }

  async rejectService(serviceId: number, adminId: string, reason?: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ 
        status: 'rejected', 
        is_active: false,
        rejection_reason: reason,
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'reject_service',
      targetType: 'service',
      targetId: serviceId.toString(),
      details: `Service rejected${reason ? `: ${reason}` : ''}`
    });

    return data as Service;
  }

  async approveJob(jobId: number, adminId: string): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'open', 
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'approve_job',
      targetType: 'job',
      targetId: jobId.toString(),
      details: 'Job approved and opened'
    });

    return data as Job;
  }

  async approveHireRequest(hireRequestId: number, adminId: string): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .update({ 
        status: 'approved', 
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', hireRequestId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'approve_hire_request',
      targetType: 'hire_request',
      targetId: hireRequestId.toString(),
      details: 'Hire request approved'
    });

    return data as HireRequest;
  }

  async rejectHireRequest(hireRequestId: number, adminId: string, response?: string): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .update({ 
        status: 'rejected', 
        admin_response: response,
        approved_by: adminId, 
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', hireRequestId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await this.createAdminAction({
      adminId,
      action: 'reject_hire_request',
      targetType: 'hire_request',
      targetId: hireRequestId.toString(),
      details: `Hire request rejected${response ? `: ${response}` : ''}`
    });

    return data as HireRequest;
  }

  async createAdminAction(action: InsertAdminAction): Promise<AdminAction> {
    const { data, error } = await supabase
      .from('admin_actions')
      .insert(action)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as AdminAction;
  }

  // Hire request operations
  async createHireRequest(hireRequest: InsertHireRequest): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .insert(hireRequest)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as HireRequest;
  }

  async getHireRequestsByClient(clientId: string): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as HireRequest[];
  }

  async getHireRequestsByFreelancer(freelancerId: string): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as HireRequest[];
  }
}

export const storage = new SupabaseStorage();