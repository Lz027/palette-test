import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize with empty strings if missing to prevent crash, 
// but the app will show configuration error via ErrorBoundary or UI checks
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing from environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const getSupabaseClient = (url?: string, anonKey?: string) => {
  const targetUrl = url || supabaseUrl;
  const targetKey = anonKey || supabaseAnonKey;
  
  if (!targetUrl || !targetKey) {
    console.error('Cannot initialize Supabase client: Missing URL or Key');
    return supabase;
  }
  
  try {
    return createClient(targetUrl, targetKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return supabase;
  }
};
