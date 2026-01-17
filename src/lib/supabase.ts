import { createClient } from '@supabase/supabase-js';

// These will be configured via the Settings page
export const getSupabaseClient = (url: string, anonKey: string) => {
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};
