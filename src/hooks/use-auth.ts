import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper to get the correct redirect URL for Vercel and Localhost
  const getRedirectUrl = () => {
    let url = window.location.origin;
    // Ensure no trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(err => {
      console.error("Auth session error:", err);
      setError(err);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGithub = async () => {
    try {
      const redirectTo = getRedirectUrl();
      console.log("GitHub Login Redirecting to:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const loginWithEmail = async (email: string) => {
    try {
      const emailRedirectTo = getRedirectUrl();
      console.log("Email Login Redirecting to:", emailRedirectTo);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      });
      if (error) throw error;
      toast.success("Login link sent to your email!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
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
