/**
 * UserAuthContext – dành cho khách hàng (customer-facing).
 * Tách biệt hoàn toàn với AuthContext (admin/staff).
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface UserAuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
}

interface UserAuthContextValue extends UserAuthState {
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserAuthState>({
    isAuthenticated: false,
    user: null,
  });

  const loginUser = (email: string, _password: string): boolean => {
    // Placeholder – tích hợp API sau
    setState({ isAuthenticated: true, user: { name: 'Khách hàng', email } });
    return true;
  };

  const logoutUser = () => {
    setState({ isAuthenticated: false, user: null });
  };

  return (
    <UserAuthContext.Provider value={{ ...state, loginUser, logoutUser }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth(): UserAuthContextValue {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
