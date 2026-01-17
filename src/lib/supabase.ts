import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing from environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = (url?: string, anonKey?: string) => {
  if (!url || !anonKey) return supabase;
  try {
    return createClient(url, anonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return supabase;
  }
};
