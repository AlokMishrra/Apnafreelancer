import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    // Check initial auth status
    checkAuthStatus();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // User logged out - clear user state immediately
        setUser(null);
        setIsLoading(false);
      } else if (session && event !== 'SIGNED_OUT') {
        // Only fetch profile if we have a session and it's not a sign out event
        fetchUserProfile(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (token?: string) => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
        }
      }

      const response = await fetch('/api/auth/user', {
        headers,
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isAdmin: userData.isAdmin,
          isFreelancer: userData.isFreelancer,
          isClient: userData.isClient,
          status: userData.status,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      await fetchUserProfile(session.data.session.access_token);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok && data.session) {
        // Set the session in Supabase client
        await supabase.auth.setSession(data.session);
        await fetchUserProfile(data.session.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signUp = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    bio?: string;
    skills?: string;
    hourlyRate?: string;
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok && data.session) {
        // Set the session in Supabase client
        await supabase.auth.setSession(data.session);
        await fetchUserProfile(data.session.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately to prevent auto-login
      setUser(null);
      
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.data.session.access_token}`,
            },
          });
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API fails
        }
      }
      
      // Sign out from Supabase (this will trigger SIGNED_OUT event)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      
      // Ensure user state is cleared
      setUser(null);
      setIsLoading(false);
      
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Ensure cleanup even on error
      setUser(null);
      setIsLoading(false);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignore errors during cleanup
      }
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    checkAuthStatus,
  };
}
