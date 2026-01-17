import { createClient } from '@supabase/supabase-js';

// Prioritize environment variables for Vercel deployment, fallback to hardcoded keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mmmfebmyxmcyirncalqw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbWZlYm15eG1jeWlybmNhbHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDA4OTYsImV4cCI6MjA4NDIxNjg5Nn0.sKao5Ot3wzqOhjLooVEZasxkryDGwEfajq9Ja9FdIK4';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = (url?: string, anonKey?: string) => {
  const targetUrl = url || supabaseUrl;
  const targetKey = anonKey || supabaseAnonKey;
  
  try {
    return createClient(targetUrl, targetKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return supabase;
  }
};
