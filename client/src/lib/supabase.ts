import { createClient } from '@supabase/supabase-js';
import { clearAuthCookies } from './clearAuthCookies';

// Using direct values from environment (configured during deployment)
const SUPABASE_URL = 'https://llvnuvujetvqjdceziys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsdm51dnVqZXR2cWpkY2V6aXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjY1MjEsImV4cCI6MjA3MjY0MjUyMX0.8-J3ll7FYugwQ0NJaviVojqdQvM1ugXe34oZrqJZmAA';

// If this is a browser environment and there might be stale auth data,
// clear it before initializing the client
if (typeof window !== 'undefined') {
  // Check if this appears to be a fresh page load
  if (!window.SUPABASE_INITIALIZED) {
    console.log("Initializing Supabase client - cleaning up any stale auth state");
    clearAuthCookies();
    window.SUPABASE_INITIALIZED = true;
  }
}

// Create the Supabase client with a custom storage implementation
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'apna-freelancer-auth',
      storage: {
        getItem: (key) => {
          try {
            const storedSession = localStorage.getItem(key);
            console.log(`Retrieved auth data for key: ${key}`);
            return storedSession;
          } catch (error) {
            console.error('Error getting auth session:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            // Remove any existing items first to avoid conflicts
            localStorage.removeItem(key);
            localStorage.setItem(key, value);
            console.log(`Stored auth data for key: ${key}`);
          } catch (error) {
            console.error('Error setting auth session:', error);
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
            console.log(`Removed auth data for key: ${key}`);
          } catch (error) {
            console.error('Error removing auth session:', error);
          }
        },
      },
    }
  }
);

// Add type definition for the global SUPABASE_INITIALIZED flag
declare global {
  interface Window {
    SUPABASE_INITIALIZED?: boolean;
  }
}