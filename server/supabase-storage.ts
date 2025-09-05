import { supabase } from "./supabase";
import type {
  User,
  UpsertUser,
  Category,
  InsertCategory,
  Service,
  InsertService,
  Job,
  InsertJob,
  Proposal,
  InsertProposal,
  Message,
  InsertMessage,
  Review,
  InsertReview,
  HireRequest,
  InsertHireRequest,
  AdminAction,
  InsertAdminAction,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  // User operations (required for Supabase Auth)
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return this.mapUserFromSupabase(data);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // No rows returned
      console.error('Error fetching user by email:', error);
      return undefined;
    }
    
    return this.mapUserFromSupabase(data);
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(this.mapUserToSupabase(userData))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    return this.mapUserFromSupabase(data);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert(this.mapUserToSupabase(userData))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }
    
    return this.mapUserFromSupabase(data);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    
    return data.map(this.mapCategoryFromSupabase);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(this.mapCategoryToSupabase(category))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
    
    return this.mapCategoryFromSupabase(data);
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
    
    if (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
    
    return data.map(this.mapServiceFromSupabase);
  }

  async getServicesByFreelancer(freelancerId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .eq('is_active', true)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch freelancer services: ${error.message}`);
    }
    
    return data.map(this.mapServiceFromSupabase);
  }

  async getService(id: number): Promise<Service | undefined> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching service:', error);
      return undefined;
    }
    
    return this.mapServiceFromSupabase(data);
  }

  async createService(service: InsertService): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(this.mapServiceToSupabase(service))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
    
    return this.mapServiceFromSupabase(data);
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...this.mapServiceToSupabase(service), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
    
    return this.mapServiceFromSupabase(data);
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
    
    if (error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
    
    return data.map(this.mapJobFromSupabase);
  }

  async getApprovedJobs(categoryId?: number, search?: string): Promise<Job[]> {
    return this.getJobs(categoryId, search); // Same as getJobs since we filter by 'open' status
  }

  async getJobsByClient(clientId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch client jobs: ${error.message}`);
    }
    
    return data.map(this.mapJobFromSupabase);
  }

  async getJob(id: number): Promise<Job | undefined> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching job:', error);
      return undefined;
    }
    
    return this.mapJobFromSupabase(data);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(this.mapJobToSupabase(job))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }
    
    return this.mapJobFromSupabase(data);
  }

  async updateJob(id: number, job: Partial<InsertJob>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...this.mapJobToSupabase(job), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update job: ${error.message}`);
    }
    
    return this.mapJobFromSupabase(data);
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

    const { data, error } = await query.order('rating', { ascending: false, nullsFirst: false });
    
    if (error) {
      throw new Error(`Failed to fetch freelancers: ${error.message}`);
    }
    
    return data.map(this.mapUserFromSupabase);
  }

  async getTopFreelancers(limit: number = 8): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_freelancer', true)
      .eq('status', 'approved')
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Failed to fetch top freelancers: ${error.message}`);
    }
    
    return data.map(this.mapUserFromSupabase);
  }

  // Proposal operations
  async getProposalsForJob(jobId: number): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch proposals: ${error.message}`);
    }
    
    return data.map(this.mapProposalFromSupabase);
  }

  async getProposalsByFreelancer(freelancerId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch freelancer proposals: ${error.message}`);
    }
    
    return data.map(this.mapProposalFromSupabase);
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .insert(this.mapProposalToSupabase(proposal))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create proposal: ${error.message}`);
    }
    
    return this.mapProposalFromSupabase(data);
  }

  async updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from('proposals')
      .update(this.mapProposalToSupabase(proposal))
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update proposal: ${error.message}`);
    }
    
    return this.mapProposalFromSupabase(data);
  }

  // Message operations
  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message }[]> {
    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    // Group by conversation partner
    const conversationMap = new Map();
    for (const message of messages) {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, message);
      }
    }

    // Get user details for each conversation
    const result = [];
    for (const [otherUserId, lastMessage] of Array.from(conversationMap)) {
      const user = await this.getUser(otherUserId);
      if (user) {
        result.push({
          user,
          lastMessage: this.mapMessageFromSupabase(lastMessage),
        });
      }
    }

    return result;
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
    
    return data.map(this.mapMessageFromSupabase);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(this.mapMessageToSupabase(message))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
    
    return this.mapMessageFromSupabase(data);
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);
    
    if (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  // Review operations
  async getReviewsForUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
    
    return data.map(this.mapReviewFromSupabase);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(this.mapReviewToSupabase(review))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }
    
    return this.mapReviewFromSupabase(data);
  }

  // Admin operations
  async getPendingUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending')
      .eq('is_admin', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch pending users: ${error.message}`);
    }
    
    return data.map(this.mapUserFromSupabase);
  }

  async getPendingServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch pending services: ${error.message}`);
    }
    
    return data.map(this.mapServiceFromSupabase);
  }

  async getPendingJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch pending jobs: ${error.message}`);
    }
    
    return data.map(this.mapJobFromSupabase);
  }

  async getPendingHireRequests(): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch pending hire requests: ${error.message}`);
    }
    
    return data.map(this.mapHireRequestFromSupabase);
  }

  async approveUser(userId: string, adminId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        status: 'approved',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to approve user: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'approve_user',
      targetType: 'user',
      targetId: userId,
      details: 'User approved',
    });
    
    return this.mapUserFromSupabase(data);
  }

  async rejectUser(userId: string, adminId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        status: 'rejected',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to reject user: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'reject_user',
      targetType: 'user',
      targetId: userId,
      details: 'User rejected',
    });
    
    return this.mapUserFromSupabase(data);
  }

  async approveService(serviceId: number, adminId: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({
        status: 'approved',
        is_active: true,
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to approve service: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'approve_service',
      targetType: 'service',
      targetId: serviceId.toString(),
      details: 'Service approved and made active',
    });
    
    return this.mapServiceFromSupabase(data);
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to reject service: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'reject_service',
      targetType: 'service',
      targetId: serviceId.toString(),
      details: `Service rejected${reason ? `: ${reason}` : ''}`,
    });
    
    return this.mapServiceFromSupabase(data);
  }

  async approveJob(jobId: number, adminId: string): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        status: 'open',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to approve job: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'approve_job',
      targetType: 'job',
      targetId: jobId.toString(),
      details: 'Job approved and opened',
    });
    
    return this.mapJobFromSupabase(data);
  }

  async approveHireRequest(hireRequestId: number, adminId: string): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .update({
        status: 'approved',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', hireRequestId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to approve hire request: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'approve_hire_request',
      targetType: 'hire_request',
      targetId: hireRequestId.toString(),
      details: 'Hire request approved',
    });
    
    return this.mapHireRequestFromSupabase(data);
  }

  async rejectHireRequest(hireRequestId: number, adminId: string, response?: string): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .update({
        status: 'rejected',
        admin_response: response,
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', hireRequestId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to reject hire request: ${error.message}`);
    }

    await this.createAdminAction({
      adminId,
      action: 'reject_hire_request',
      targetType: 'hire_request',
      targetId: hireRequestId.toString(),
      details: `Hire request rejected${response ? `: ${response}` : ''}`,
    });
    
    return this.mapHireRequestFromSupabase(data);
  }

  async createAdminAction(action: InsertAdminAction): Promise<AdminAction> {
    const { data, error } = await supabase
      .from('admin_actions')
      .insert(this.mapAdminActionToSupabase(action))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create admin action: ${error.message}`);
    }
    
    return this.mapAdminActionFromSupabase(data);
  }

  // Hire request operations
  async createHireRequest(hireRequest: InsertHireRequest): Promise<HireRequest> {
    const { data, error } = await supabase
      .from('hire_requests')
      .insert(this.mapHireRequestToSupabase(hireRequest))
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create hire request: ${error.message}`);
    }
    
    return this.mapHireRequestFromSupabase(data);
  }

  async getHireRequestsByClient(clientId: string): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch client hire requests: ${error.message}`);
    }
    
    return data.map(this.mapHireRequestFromSupabase);
  }

  async getHireRequestsByFreelancer(freelancerId: string): Promise<HireRequest[]> {
    const { data, error } = await supabase
      .from('hire_requests')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch freelancer hire requests: ${error.message}`);
    }
    
    return data.map(this.mapHireRequestFromSupabase);
  }

  // Mapping functions to convert between Supabase snake_case and our camelCase
  private mapUserFromSupabase(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.first_name,
      lastName: data.last_name,
      profileImageUrl: data.profile_image_url,
      bio: data.bio,
      skills: data.skills,
      hourlyRate: data.hourly_rate,
      isFreelancer: data.is_freelancer,
      isClient: data.is_client,
      isAdmin: data.is_admin,
      status: data.status,
      rating: data.rating,
      totalReviews: data.total_reviews,
      location: data.location,
      availability: data.availability,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapUserToSupabase(data: any): any {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      profile_image_url: data.profileImageUrl,
      bio: data.bio,
      skills: data.skills,
      hourly_rate: data.hourlyRate,
      is_freelancer: data.isFreelancer,
      is_client: data.isClient,
      is_admin: data.isAdmin,
      status: data.status,
      rating: data.rating,
      total_reviews: data.totalReviews,
      location: data.location,
      availability: data.availability,
      approved_by: data.approvedBy,
      approved_at: data.approvedAt,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }

  private mapCategoryFromSupabase(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      createdAt: data.created_at,
    };
  }

  private mapCategoryToSupabase(data: any): any {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      icon: data.icon,
      created_at: data.createdAt,
    };
  }

  private mapServiceFromSupabase(data: any): Service {
    return {
      id: data.id,
      freelancerId: data.freelancer_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      price: data.price,
      deliveryTime: data.delivery_time,
      images: data.images,
      skills: data.skills,
      status: data.status,
      isActive: data.is_active,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      rejectionReason: data.rejection_reason,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapServiceToSupabase(data: any): any {
    return {
      id: data.id,
      freelancer_id: data.freelancerId,
      category_id: data.categoryId,
      title: data.title,
      description: data.description,
      price: data.price,
      delivery_time: data.deliveryTime,
      images: data.images,
      skills: data.skills,
      status: data.status,
      is_active: data.isActive,
      approved_by: data.approvedBy,
      approved_at: data.approvedAt,
      rejection_reason: data.rejectionReason,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }

  private mapJobFromSupabase(data: any): Job {
    return {
      id: data.id,
      clientId: data.client_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      budget: data.budget,
      duration: data.duration,
      experienceLevel: data.experience_level,
      skills: data.skills,
      status: data.status,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapJobToSupabase(data: any): any {
    return {
      id: data.id,
      client_id: data.clientId,
      category_id: data.categoryId,
      title: data.title,
      description: data.description,
      budget: data.budget,
      duration: data.duration,
      experience_level: data.experienceLevel,
      skills: data.skills,
      status: data.status,
      approved_by: data.approvedBy,
      approved_at: data.approvedAt,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }

  private mapProposalFromSupabase(data: any): Proposal {
    return {
      id: data.id,
      jobId: data.job_id,
      freelancerId: data.freelancer_id,
      coverLetter: data.cover_letter,
      proposedPrice: data.proposed_price,
      deliveryTime: data.delivery_time,
      status: data.status,
      createdAt: data.created_at,
    };
  }

  private mapProposalToSupabase(data: any): any {
    return {
      id: data.id,
      job_id: data.jobId,
      freelancer_id: data.freelancerId,
      cover_letter: data.coverLetter,
      proposed_price: data.proposedPrice,
      delivery_time: data.deliveryTime,
      status: data.status,
      created_at: data.createdAt,
    };
  }

  private mapMessageFromSupabase(data: any): Message {
    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      content: data.content,
      isRead: data.is_read,
      createdAt: data.created_at,
    };
  }

  private mapMessageToSupabase(data: any): any {
    return {
      id: data.id,
      sender_id: data.senderId,
      receiver_id: data.receiverId,
      content: data.content,
      is_read: data.isRead,
      created_at: data.createdAt,
    };
  }

  private mapReviewFromSupabase(data: any): Review {
    return {
      id: data.id,
      reviewerId: data.reviewer_id,
      revieweeId: data.reviewee_id,
      jobId: data.job_id,
      serviceId: data.service_id,
      hireRequestId: data.hire_request_id,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.created_at,
    };
  }

  private mapReviewToSupabase(data: any): any {
    return {
      id: data.id,
      reviewer_id: data.reviewerId,
      reviewee_id: data.revieweeId,
      job_id: data.jobId,
      service_id: data.serviceId,
      hire_request_id: data.hireRequestId,
      rating: data.rating,
      comment: data.comment,
      created_at: data.createdAt,
    };
  }

  private mapHireRequestFromSupabase(data: any): HireRequest {
    return {
      id: data.id,
      clientId: data.client_id,
      freelancerId: data.freelancer_id,
      projectTitle: data.project_title,
      projectDescription: data.project_description,
      budget: data.budget,
      deadline: data.deadline,
      status: data.status,
      clientMessage: data.client_message,
      adminResponse: data.admin_response,
      approvedBy: data.approved_by,
      approvedAt: data.approved_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapHireRequestToSupabase(data: any): any {
    return {
      id: data.id,
      client_id: data.clientId,
      freelancer_id: data.freelancerId,
      project_title: data.projectTitle,
      project_description: data.projectDescription,
      budget: data.budget,
      deadline: data.deadline,
      status: data.status,
      client_message: data.clientMessage,
      admin_response: data.adminResponse,
      approved_by: data.approvedBy,
      approved_at: data.approvedAt,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }

  private mapAdminActionFromSupabase(data: any): AdminAction {
    return {
      id: data.id,
      adminId: data.admin_id,
      action: data.action,
      targetType: data.target_type,
      targetId: data.target_id,
      details: data.details,
      createdAt: data.created_at,
    };
  }

  private mapAdminActionToSupabase(data: any): any {
    return {
      id: data.id,
      admin_id: data.adminId,
      action: data.action,
      target_type: data.targetType,
      target_id: data.targetId,
      details: data.details,
      created_at: data.createdAt,
    };
  }
}

export const supabaseStorage = new SupabaseStorage();