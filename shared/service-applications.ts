// Service application schema for users to apply to services
import { pgTable, serial, integer, text, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { services, users } from "./schema";
import { relations } from "drizzle-orm";

// Service applications submitted by freelancers
export const serviceApplications = pgTable("service_applications", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  freelancerId: varchar("freelancer_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  proposedPrice: decimal("proposed_price", { precision: 10, scale: 2 }).notNull(),
  deliveryTime: integer("delivery_time").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const serviceApplicationsRelations = relations(serviceApplications, ({ one }) => ({
  service: one(services, {
    fields: [serviceApplications.serviceId],
    references: [services.id],
  }),
  freelancer: one(users, {
    fields: [serviceApplications.freelancerId],
    references: [users.id],
  }),
}));

// Insert schema
export const insertServiceApplicationSchema = createInsertSchema(serviceApplications).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type InsertServiceApplication = typeof serviceApplications.$inferInsert;
export type ServiceApplication = typeof serviceApplications.$inferSelect;