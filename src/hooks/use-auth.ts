import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get the base URL for redirects, ensuring it works on Vercel and locally
  const getRedirectUrl = () => {
    let url = window.location.origin;
    // Ensure it doesn't have a trailing slash
    return url.replace(/\/$/, "");
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Auth session check failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to check auth session'));
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: getRedirectUrl()
      }
    });
    if (error) throw error;
  };

  const loginWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    loginWithGithub,
    loginWithEmail,
    logout,
  };
}
