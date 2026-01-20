import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock user type for demo purposes
interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const MOCK_USER_KEY = 'palette_mock_user';

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing mock session
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(MOCK_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithGithub = async () => {
    // Mock GitHub login
    const mockUser: MockUser = {
      id: crypto.randomUUID(),
      email: 'github-user@example.com',
      name: 'GitHub User',
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success('Logged in with GitHub (Demo Mode)');
  };

  const loginWithEmail = async (email: string) => {
    // Mock email login - accepts any email
    const mockUser: MockUser = {
      id: crypto.randomUUID(),
      email: email,
      name: email.split('@')[0],
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Logged in as ${email} (Demo Mode)`);
  };

  const logout = async () => {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
    toast.success('Logged out');
  };

  return {
    user,
    isLoading,
    error: null,
    isAuthenticated: !!user,
    loginWithGithub,
    loginWithEmail,
    logout,
  };
}
