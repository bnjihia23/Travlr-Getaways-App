import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import { loginUser, registerUser, setAuthToken } from '@/lib/api';

interface AuthContextValue {
  token: string | null;
  userEmail: string | null;
  initializing: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = '@travlr/authToken';
const EMAIL_KEY = '@travlr/authEmail';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Load saved token/email on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [storedToken, storedEmail] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(EMAIL_KEY),
        ]);

        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }
        if (storedEmail) {
          setUserEmail(storedEmail);
        }
      } catch (error) {
        console.warn('Error loading auth state', error);
      } finally {
        setInitializing(false);
      }
    };

    loadAuth();
  }, []);

  const persistAuth = async (email: string, newToken: string) => {
    setToken(newToken);
    setUserEmail(email);
    setAuthToken(newToken);

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(EMAIL_KEY, email),
    ]);
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const result = await loginUser(email, password); // { token }
      await persistAuth(email, result.token);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    try {
      const result = await registerUser(name, email, password); // { token }
      // Auto-log in after successful registration
      await persistAuth(email, result.token);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUserEmail(null);
    setAuthToken(null);

    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(EMAIL_KEY),
    ]);
  };

  const value: AuthContextValue = {
    token,
    userEmail,
    initializing,
    authLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
