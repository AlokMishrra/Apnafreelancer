import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { createClient } from '@supabase/supabase-js';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Make DATABASE_URL optional for local development
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Keep existing Neon database connection for data storage
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null as any;
export const db = pool ? drizzle({ client: pool, schema }) : null as any;

// Create Supabase client for authentication only
export const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;