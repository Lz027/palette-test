import { createClient } from '@supabase/supabase-js';

// Using provided keys directly as requested
// Project Ref: mmmfebmyxmcyirncalqw
const supabaseUrl = 'https://mmmfebmyxmcyirncalqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbWZlYm15eG1jeWlybmNhbHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDA4OTYsImV4cCI6MjA4NDIxNjg5Nn0.sKao5Ot3wzqOhjLooVEZasxkryDGwEfajq9Ja9FdIK4';

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
