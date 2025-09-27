import { clearAuthCookies } from './clearAuthCookies';
import { supabase } from './supabase';

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// Utility to manually reset authentication state
// This can be used if a user is still experiencing issues with sign-in
export async function resetAuthState() {
  console.log("Performing complete auth reset...");
  
  // Clear all cookies and localStorage
  clearAuthCookies();
  
  // Sign out from Supabase
  try {
    await supabase.auth.signOut();
    console.log("Signed out from Supabase");
  } catch (error) {
    console.error("Error signing out from Supabase:", error);
  }
  
  // Additional cleanup - clear IndexedDB if it exists
  try {
    const databases = await window.indexedDB.databases();
    for (const db of databases) {
      if (db.name && (
        db.name.includes('supabase') || 
        db.name.includes('auth') ||
        db.name.includes('apna')
      )) {
        console.log(`Deleting IndexedDB database: ${db.name}`);
        window.indexedDB.deleteDatabase(db.name);
      }
    }
  } catch (error) {
    console.error("Error clearing IndexedDB databases:", error);
  }
  
  console.log("Auth reset complete. Reloading page...");
  
  // Force a hard reload of the page
  setTimeout(() => {
    window.location.href = window.location.pathname + '?t=' + new Date().getTime();
  }, 500);
}