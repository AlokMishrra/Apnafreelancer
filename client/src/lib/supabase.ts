import { createClient } from '@supabase/supabase-js';

// Using direct values from environment (configured during deployment)
const SUPABASE_URL = 'https://llvnuvujetvqjdceziys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsdm51dnVqZXR2cWpkY2V6aXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjY1MjEsImV4cCI6MjA3MjY0MjUyMX0.8-J3ll7FYugwQ0NJaviVojqdQvM1ugXe34oZrqJZmAA';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);