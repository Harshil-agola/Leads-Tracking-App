import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_ROUTES } from '../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(AUTH_ROUTES.VERIFY, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setAdminEmail(data.user?.email || null);
        } else {
          setIsAuthenticated(false);
          setAdminEmail(null);
        }
      } catch {
        setIsAuthenticated(false);
        setAdminEmail(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch(AUTH_ROUTES.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setAdminEmail(data.user?.email || email);
        return { success: true };
      }

      return { success: false, message: data.message || 'Invalid admin credentials' };
    } catch {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch(AUTH_ROUTES.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
    } finally {
      setIsAuthenticated(false);
      setAdminEmail(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
