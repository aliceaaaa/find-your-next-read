import { createContext, ReactNode, useContext, useState } from 'react';
import { apiLogin, apiLogout, clearToken, getToken, setToken } from 'api';

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
  defaultIsAdmin = false,
}: {
  children: ReactNode;
  defaultIsAdmin?: boolean;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  const isAdmin = defaultIsAdmin || isAuthenticated;

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.token);
    setUser(res.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    apiLogout().catch(() => {});
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
