import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { profileApi } from '../api/profileApi';
import type { LoginRequest, RegisterRequest } from '../types/auth';
import type { Profile } from '../types/profile';

interface AuthContextValue {
  isAuthenticated: boolean;
  userProfile: Profile | null;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const fetchProfile = async (): Promise<Profile | null> => {
    try {
      const p = await profileApi.getMine();
      setUserProfile(p);
      return p;
    } catch {
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUserProfile(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const storeTokensAndFetch = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    await fetchProfile();
  };

  const login = async (req: LoginRequest) => {
    const data = await authApi.login(req);
    await storeTokensAndFetch(data.accessToken, data.refreshToken);
  };

  const register = async (req: RegisterRequest) => {
    const data = await authApi.register(req);
    await storeTokensAndFetch(data.accessToken, data.refreshToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        login,
        register,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

