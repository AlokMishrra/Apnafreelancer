// Utility to clear ALL authentication-related storage
export function clearAuthCookies() {
  console.log("Clearing all auth data...");
  
  // Clear ALL cookies (a more aggressive approach)
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
  }
  
  // Clear all localStorage items that could be related to auth
  // Get all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      // Clear any key that could be related to auth
      if (
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('token') || 
        key.includes('session') || 
        key.includes('user') ||
        key.includes('apna-freelancer')
      ) {
        localStorage.removeItem(key);
        console.log(`Removed localStorage item: ${key}`);
      }
    }
  }
  
  // Specific known items to clear
  const keysToRemove = [
    'sb-refresh-token',
    'sb-access-token',
    'supabase.auth.token',
    'apna-freelancer-auth',
    'supabase-auth-token',
    'supabase.auth.user'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log("Auth data clearing complete");
}
