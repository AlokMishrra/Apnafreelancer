import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isFreelancer: true,
      isClient: true,
    });

    // Create session
    (req.session as any).userId = user.id;
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Get user by email
    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Create session
    (req.session as any).userId = user.id;
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Logout failed" });
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const session = req.session as any;
  
  if (!session || !session.userId || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = session.user;
  next();
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  const session = req.session as any;
  
  if (!session || !session.userId || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json(session.user);
}