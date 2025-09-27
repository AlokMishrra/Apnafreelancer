import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { clearAuthCookies } from '../lib/clearAuthCookies';
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
    // Initialize auth and clean up stale data
    const initAuth = async () => {
      try {
        console.log("Initializing auth and checking for existing session");
        
        // Try to get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log(`Found existing session for user ID: ${session.user.id}`);
          
          try {
            // Try to fetch the user profile
            await fetchUserProfile(session.user.id);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            
            // If we can't fetch the profile, the session might be invalid
            // Clear everything and sign out
            console.log("Failed to fetch user profile - clearing auth state");
            clearAuthCookies();
            await supabase.auth.signOut();
            setUser(null);
            setIsLoading(false);
          }
        } else {
          console.log("No active session found");
          // No active session, ensure we're in a clean state
          clearAuthCookies();
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If there's any error, reset everything
        clearAuthCookies();
        await supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      } else if (session?.user) {
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
    try {
      // First, ensure we're starting with a clean state - aggressive cleanup
      await supabase.auth.signOut();
      clearAuthCookies();
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Attempting to sign in user: ${email}`);
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        throw new Error(error.message);
      }

      console.log("Sign-in successful, fetching user profile");
      if (data.user) {
        await fetchUserProfile(data.user.id);
        console.log("User profile fetched successfully");
      }

      return data;
    } catch (error) {
      console.error('Error during sign in:', error);
      setUser(null);
      throw error;
    }
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
    try {
      console.log("Starting sign out process - cleaning up all auth data");
      
      // Reset user state first to avoid any React state issues
      setUser(null);
      
      // Clear auth cookies and local storage - do this before AND after the Supabase call
      clearAuthCookies();
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error from Supabase during sign out:", error);
        // Continue anyway - we want to clean everything
      }
      
      // Double-check that everything is cleared
      clearAuthCookies();
      
      console.log("Sign out process complete - redirecting to home page");
      
      // Use a slight delay before redirect to ensure cleanup is complete
      setTimeout(() => {
        // Use replace instead of href to avoid keeping the previous page in history
        window.location.replace('/');
      }, 100);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Ensure user state is reset even if there's an error
      setUser(null);
      
      // Still try to clear cookies and redirect
      clearAuthCookies();
      
      // Redirect anyway with a delay
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
      
      throw error;
    }
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
