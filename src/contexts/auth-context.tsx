import { createContext, ReactNode, useContext, useState } from "react";
import { apiLogin, apiLogout, clearToken, getToken, setToken } from "api";

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

const USER_KEY = "auth_user";

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const storeUser = (user: AuthUser | null) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Storage unavailable; the user just won't survive a reload.
  }
};

export const AuthProvider = ({
  children,
  defaultIsAdmin = false,
}: {
  children: ReactNode;
  defaultIsAdmin?: boolean;
}) => {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getToken() ? readStoredUser() : null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

  const isAdmin = defaultIsAdmin || isAuthenticated;

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.token);
    storeUser(res.user);
    setUser(res.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    apiLogout().catch(() => {});
    clearToken();
    storeUser(null);
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
