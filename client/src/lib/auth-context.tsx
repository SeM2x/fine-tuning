import * as React from 'react';
import { getCurrentUser, login, logout, register, type AuthResponse, type LoginRequest, type RegisterRequest } from '@/api/auth';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if user is already logged in on mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = React.useCallback(async (credentials: LoginRequest) => {
    const response: AuthResponse = await login(credentials);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  }, []);

  const handleRegister = React.useCallback(async (userData: RegisterRequest) => {
    const response: AuthResponse = await register(userData);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  }, []);

  const handleLogout = React.useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [user, isLoading, handleLogin, handleRegister, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
