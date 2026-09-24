import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://buqkdtnffjoiwwtfxiek.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWtkdG5mZmpvaXd3dGZ4aWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjI5NjQsImV4cCI6MjA4OTU5ODk2NH0.FW_VUPDN7hPnSBapQGS9Vh7YusX05Z_cpzu8f4-d1q4";

// Strict timeout fetch wrapper to ensure requests fail gracefully within 10 seconds if unreachable
const fetchWith10sTimeout = (resource, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error("Supabase request timeout: 10000ms")), 10000);
  return fetch(resource, {
    ...options,
    signal: options.signal || controller.signal,
  }).finally(() => clearTimeout(timeoutId));
};

let supabaseInstance;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

    if (typeof window === "undefined") {
      // Server / Node.js / SSR environment: Use robust server client with fetch timeout
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          fetch: fetchWith10sTimeout,
        },
      });
    } else {
      // Browser environment: Use SSR browser client with session persistence
      supabaseInstance = createBrowserClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
  }
  return supabaseInstance;
}

// Export for legacy compatibility while transition happens
export const supabase = getSupabaseClient();