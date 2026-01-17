import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

// MOCK USER for temporary testing bypass
const MOCK_USER: User = {
  id: 'test-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useAuth() {
  // Set user to MOCK_USER immediately to bypass login
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Keep user as MOCK_USER
    setUser(MOCK_USER);
    setIsLoading(false);
  }, []);

  const loginWithGithub = async () => {
    console.log("GitHub login bypassed");
  };

  const loginWithEmail = async (email: string) => {
    console.log("Email login bypassed for:", email);
  };

  const logout = async () => {
    // For testing, we can just clear the mock user if needed, 
    // but usually we want to stay "logged in" for this bypass
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: true, // Always true for bypass
    loginWithGithub,
    loginWithEmail,
    logout,
  };
}
