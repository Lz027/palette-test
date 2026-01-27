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
  // Pure local storage "auth"
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('palette_local_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginWithGithub = async () => {
    setUser(MOCK_USER);
    localStorage.setItem('palette_local_user', JSON.stringify(MOCK_USER));
    toast.success("Welcome back!");
  };

  const loginWithEmail = async (email: string) => {
    const user = { ...MOCK_USER, email };
    setUser(user);
    localStorage.setItem('palette_local_user', JSON.stringify(user));
    toast.success("Welcome back!");
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('palette_local_user');
    toast.success("Logged out");
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
