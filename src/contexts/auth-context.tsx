import { createContext, ReactNode, useContext, useState } from 'react';
import { apiLogin, clearToken, setToken } from 'api';

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthContextValue = {
  isAdmin: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
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

  const isAdmin = defaultIsAdmin || user !== null;

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
