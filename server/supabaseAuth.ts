import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { supabase as adminSupabase } from './supabase';

// Create a client with anon key for user authentication operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://llvnuvujetvqjdceziys.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsdm51dnVqZXR2cWpkY2V6aXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjY1MjEsImV4cCI6MjA3MjY0MjUyMX0.8-J3ll7FYugwQ0NJaviVojqdQvM1ugXe34oZrqJZmAA';

// Client for user authentication (signIn, signUp)
const userAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Use admin client for admin operations
const supabase = adminSupabase;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
  };
}

// Middleware to verify JWT token from Supabase
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user profile from our custom table if needed
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      firstName: profile?.first_name || user.user_metadata?.first_name,
      lastName: profile?.last_name || user.user_metadata?.last_name,
      isAdmin: profile?.is_admin || false,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.user);
}

// Admin authorization middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

// Register user with Supabase Auth
export async function registerUser(req: Request, res: Response) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      role,
      bio,
      skills,
      hourlyRate
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "Email, password, first name, and last name are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Determine user roles
    const isFreelancer = role === 'freelancer' || role === 'both';
    const isClient = role === 'client' || role === 'both';

    // Create user with Supabase Auth (using admin client for server-side)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      },
      email_confirm: true // Auto-confirm email for server-side registration
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        return res.status(400).json({ 
          message: "User with this email already exists" 
        });
      }
      return res.status(400).json({ 
        message: error.message || "Registration failed" 
      });
    }

    if (!data.user) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Create user profile in our custom table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        is_freelancer: isFreelancer,
        is_client: isClient,
        bio: bio || null,
        skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : null,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        status: 'pending', // New users require admin approval
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Try to delete the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error('Failed to cleanup auth user:', deleteError);
      }
      return res.status(500).json({ 
        message: "Failed to create user profile",
        error: profileError.message 
      });
    }

    // Sign in the user to get a session (use anon key client for user auth)
    const { data: signInData, error: signInError } = await userAuthClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      // User created but couldn't sign in - they'll need to sign in manually
      return res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName,
          lastName,
          isAdmin: false,
          isFreelancer,
          isClient,
        },
        message: "Account created successfully. Please sign in."
      });
    }

    res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
        isAdmin: false,
        isFreelancer,
        isClient,
      },
      session: signInData.session
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
}

// Login user with Supabase Auth
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const { data, error } = await userAuthClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return res.status(401).json({ 
        message: error?.message || "Invalid email or password" 
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If profile doesn't exist, that's okay - user might be newly created
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
    }

    return res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || data.user.user_metadata?.first_name || '',
        lastName: profile?.last_name || data.user.user_metadata?.last_name || '',
        isAdmin: profile?.is_admin || false,
        isFreelancer: profile?.is_freelancer || false,
        isClient: profile?.is_client || false,
      },
      session: data.session
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: error?.message || "Login failed" 
    });
  }
}

// Logout user
export async function logoutUser(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        // Try to sign out the user session
        await userAuthClient.auth.signOut();
        // Also try admin signOut for cleanup
        await supabase.auth.admin.signOut(token);
      } catch (error) {
        console.error('SignOut error:', error);
        // Continue anyway - the client will handle local cleanup
      }
    }
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    // Still return success - client handles local cleanup
    res.json({ message: "Logged out successfully" });
  }
}