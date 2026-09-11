import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { refreshAccessToken } from '@/api/client';
import { setAccessToken } from '@/api/tokenStore';
import type { User } from '@/types/auth';
import { loginRequest, logoutRequest, meRequest, registerRequest } from './api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = await refreshAccessToken();
      if (cancelled) return;

      if (!token) {
        setStatus('unauthenticated');
        return;
      }

      try {
        const currentUser = await meRequest();
        if (cancelled) return;
        setUser(currentUser);
        setStatus('authenticated');
      } catch {
        if (cancelled) return;
        setAccessToken(null);
        setStatus('unauthenticated');
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedInUser, accessToken } = await loginRequest({ email, password });
    setAccessToken(accessToken);
    setUser(loggedInUser);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: createdUser, accessToken } = await registerRequest({ name, email, password });
    setAccessToken(accessToken);
    setUser(createdUser);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
