import { Request, Response, NextFunction } from 'express';
import { supabase } from './supabase';

export interface SupabaseAuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
    isFreelancer?: boolean;
    isClient?: boolean;
    status?: string;
  };
}

// Middleware to verify Supabase JWT token
export async function requireSupabaseAuth(req: SupabaseAuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Check for Authorization header
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    // Also check for token in cookies as a fallback
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('apna-freelancer-auth='));
      if (authCookie) {
        try {
          const cookieValue = decodeURIComponent(authCookie.split('=')[1]);
          const parsedCookie = JSON.parse(cookieValue);
          token = parsedCookie.access_token;
        } catch (e) {
          console.error('Error parsing auth cookie:', e);
        }
      }
    }
    
    if (!token) {
      console.error('Authentication failed: No token provided');
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    console.log('Authenticating with token:', token.substring(0, 10) + '...');
    
    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Authentication failed:', error);
      return res.status(401).json({ message: 'Invalid token: ' + error.message });
    }
    
    if (!data.user) {
      console.error('Authentication failed: No user found');
      return res.status(401).json({ message: 'Invalid token: No user found' });
    }

    // Get user profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: 'User profile not found' });
    }

    // Attach user info to request
    req.user = {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      isAdmin: profile.is_admin,
      isFreelancer: profile.is_freelancer,
      isClient: profile.is_client,
      status: profile.status,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

// Middleware to require admin privileges
export async function requireSupabaseAdmin(req: SupabaseAuthenticatedRequest, res: Response, next: NextFunction) {
  await requireSupabaseAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
}

// Get current user from token
export async function getCurrentSupabaseUser(req: SupabaseAuthenticatedRequest, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: 'User profile not found' });
    }

    const userInfo = {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      isAdmin: profile.is_admin,
      isFreelancer: profile.is_freelancer,
      isClient: profile.is_client,
      status: profile.status,
    };

    res.json(userInfo);
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
}