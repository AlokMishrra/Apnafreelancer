import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {};
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
      
      // For debugging purposes
      console.log("Got valid auth token:", session.access_token.substring(0, 10) + "...");
    } else {
      console.warn("No active auth session found");
    }
    
    return headers;
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return {};
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  const headers = {
    ...authHeaders,
    ...(data ? { "Content-Type": "application/json" } : {}),
  };
  
  console.log(`Making ${method} request to ${url} with auth headers:`, 
    authHeaders.Authorization ? "Bearer token present" : "No authorization token");
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include', // Always include credentials
  });

  if (!res.ok) {
    console.error(`API request failed: ${res.status} ${res.statusText}`);
    try {
      const errorData = await res.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `${res.status}: ${res.statusText}`);
    } catch (e) {
      // If JSON parsing fails, use the text or status
      const errorText = await res.text();
      throw new Error(errorText || `${res.status}: ${res.statusText}`);
    }
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(queryKey.join("/") as string, {
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
