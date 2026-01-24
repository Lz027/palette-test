import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock user for bypass
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

export function useAuth() {
  // Always authenticated with mock user
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getRedirectUrl = () => {
    let url = window.location.origin;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };

  useEffect(() => {
    // We keep the listener but don't let it block the mock user
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGithub = async () => {
    // For bypass, we just set the mock user
    setUser(MOCK_USER);
    toast.success("Bypassed login with GitHub");
  };

  const loginWithEmail = async (email: string) => {
    // For bypass, we just set the mock user
    setUser(MOCK_USER);
    toast.success("Bypassed login with Email");
  };

  const logout = async () => {
    setUser(null);
    toast.success("Logged out successfully");
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
