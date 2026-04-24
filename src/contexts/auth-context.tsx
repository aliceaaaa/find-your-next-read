import { createContext, ReactNode, useContext } from 'react';

type AuthContextValue = {
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
});

export const AuthProvider = ({
  children,
  defaultIsAdmin = false,
}: {
  children: ReactNode;
  defaultIsAdmin?: boolean;
}) => {
  return (
    <AuthContext.Provider value={{ isAdmin: defaultIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
