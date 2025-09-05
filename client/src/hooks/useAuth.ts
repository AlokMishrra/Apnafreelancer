import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  isFreelancer?: boolean;
  isClient?: boolean;
  status?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else if (data) {
        setUser({
          id: data.id,
          email: data.email || '',
          firstName: data.first_name,
          lastName: data.last_name,
          isAdmin: data.is_admin,
          isFreelancer: data.is_freelancer,
          isClient: data.is_client,
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return data;
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    additionalData?: {
      isFreelancer?: boolean;
      isClient?: boolean;
      bio?: string | null;
      skills?: string[];
      hourlyRate?: string | null;
    }
  ) => {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // Then create the user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        is_freelancer: additionalData?.isFreelancer || false,
        is_client: additionalData?.isClient || false,
        bio: additionalData?.bio,
        skills: additionalData?.skills,
        hourly_rate: additionalData?.hourlyRate ? parseFloat(additionalData.hourlyRate) : null,
        status: 'pending', // All new users require approval
      })
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, we should delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Failed to create user profile: ' + profileError.message);
    }

    // Update the user state
    if (profileData) {
      setUser({
        id: profileData.id,
        email: profileData.email || '',
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        isAdmin: profileData.is_admin,
        isFreelancer: profileData.is_freelancer,
        isClient: profileData.is_client,
        status: profileData.status,
      });
    }

    return { user: authData.user, profile: profileData };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}
