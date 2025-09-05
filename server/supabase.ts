import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Server-side functions for Supabase Auth integration
export async function createUserProfile(userId: string, userData: any) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      is_freelancer: userData.isFreelancer || false,
      is_client: userData.isClient || false,
      bio: userData.bio,
      skills: userData.skills,
      hourly_rate: userData.hourlyRate ? parseFloat(userData.hourlyRate) : null,
      status: 'pending', // All new users require approval
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data;
}