import { db } from './db';
import { eq, and } from 'drizzle-orm';
import { serviceApplications } from '../shared/service-applications';
import type { ServiceApplication, InsertServiceApplication } from '../shared/service-applications';
import { SupabaseStorage } from './supabaseStorage';

// Extending the SupabaseStorage class with service application methods
export class ServiceApplicationsStorage extends SupabaseStorage {
  // Get service application by freelancer and service
  async getServiceApplicationByFreelancer(
    serviceId: number,
    freelancerId: string
  ): Promise<ServiceApplication | undefined> {
    try {
      const result = await db.query.serviceApplications.findFirst({
        where: and(
          eq(serviceApplications.serviceId, serviceId),
          eq(serviceApplications.freelancerId, freelancerId)
        ),
      });
      
      return result;
    } catch (error) {
      console.error('Error getting service application by freelancer:', error);
      return undefined;
    }
  }

  // Create a new service application
  async createServiceApplication(
    application: InsertServiceApplication
  ): Promise<ServiceApplication> {
    try {
      const result = await db
        .insert(serviceApplications)
        .values(application)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating service application:', error);
      throw new Error('Failed to create service application');
    }
  }

  // Get all applications for a specific service
  async getServiceApplications(serviceId: number): Promise<ServiceApplication[]> {
    try {
      const result = await db.query.serviceApplications.findMany({
        where: eq(serviceApplications.serviceId, serviceId),
        orderBy: (serviceApplications, { desc }) => [desc(serviceApplications.createdAt)]
      });
      
      return result;
    } catch (error) {
      console.error('Error getting service applications:', error);
      return [];
    }
  }

  // Get all applications by a freelancer
  async getFreelancerApplications(freelancerId: string): Promise<ServiceApplication[]> {
    try {
      const result = await db.query.serviceApplications.findMany({
        where: eq(serviceApplications.freelancerId, freelancerId),
        orderBy: (serviceApplications, { desc }) => [desc(serviceApplications.createdAt)]
      });
      
      return result;
    } catch (error) {
      console.error('Error getting freelancer applications:', error);
      return [];
    }
  }
}