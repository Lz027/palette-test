import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Mock user for bypass
const MOCK_USER: any = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' },
};

export function useAuth() {
  // Pure local storage "auth"
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('palette_local_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginWithGithub = async () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setUser(MOCK_USER);
      localStorage.setItem('palette_local_user', JSON.stringify(MOCK_USER));
      setIsLoading(false);
      toast.success("Welcome back!");
    }, 1000);
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = { ...MOCK_USER, email };
      setUser(user);
      localStorage.setItem('palette_local_user', JSON.stringify(user));
      setIsLoading(false);
      toast.success("Welcome back!");
    }, 1000);
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
