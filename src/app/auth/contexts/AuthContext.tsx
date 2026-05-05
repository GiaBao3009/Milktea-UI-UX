import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { encryptForClient } from '@app/utils/encryption';
import { extractRows } from '@app/services/api';

export type AppRole = 'admin' | 'manager' | 'staff' | 'cashier';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  appRole: AppRole;
  token: string;
  branchId?: number;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AdminUser }>;
  logout: () => void;
}

export function getDefaultRouteForRole(role?: AppRole): string {
  switch (role) {
    case 'admin':
    case 'manager':
      return '/admin';
    case 'staff':
    case 'cashier':
      return '/admin/orders';
    default:
      return '/admin';
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'chips_admin_user';
const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function fetchFirstBranchId(token: string): Promise<number | undefined> {
  const res = await fetch(`${API_BASE}/api/branches?limit=50`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(8000),
  });

  const json = await res.json().catch(() => null);
  const payload = (json?.res_code !== undefined) ? json.data : json;

  if (!res.ok || !payload) return undefined;

  const branches = extractRows<{ id?: string | number }>(payload);
  const firstBranchId = branches[0]?.id;
  return firstBranchId != null ? Number(firstBranchId) : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const user: AdminUser = JSON.parse(raw);
        setState({ user, isAuthenticated: true, isLoading: false });
        return;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const login = async (
    emailOrUsername: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: AdminUser }> => {
    if (API_BASE) {
      try {
        // Mã hóa mật khẩu bằng RSA public key trước khi gửi
        const encryptedPassword = await encryptForClient(password);

        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: emailOrUsername, password: encryptedPassword }),
          signal: AbortSignal.timeout(8000),
        });

        const json = await res.json().catch(() => null);

        // Unwrap CustomResponseDto
        const payload = (json?.res_code !== undefined) ? json.data : json;

        if (res.ok && payload) {
          const token: string =
            payload.token ?? payload.accessToken ?? payload.access_token ?? '';
          const userObj = payload.user ?? payload.account ?? payload;
          const roles: unknown[] = userObj?.roles ?? userObj?.role ?? [];
          const firstRole = Array.isArray(roles)
            ? (typeof roles[0] === 'object' ? (roles[0] as Record<string, unknown>)?.name : roles[0])
            : roles;

          // Debug: xem API trả về gì để tìm đúng field branchId
          console.log('🔍 [Login] payload:', payload);
          console.log('🔍 [Login] userObj:', userObj);

          const rawBranchId =
            userObj?.branchId ??
            userObj?.branch_id ??
            userObj?.branch?.id ??
            payload?.branchId ??
            payload?.branch_id;

          const branchId = rawBranchId != null ? Number(rawBranchId) : undefined;
          console.log('🔍 [Login] branchId parsed:', branchId);

          const user: AdminUser = {
            id: String(userObj?.id ?? userObj?.userId ?? 'usr-api'),
            username: userObj?.username ?? userObj?.userName ?? emailOrUsername,
            email: userObj?.email ?? emailOrUsername,
            fullName: userObj?.fullName ?? userObj?.name ?? emailOrUsername,
            appRole: (String(firstRole ?? '').toLowerCase() as AppRole) || 'staff',
            token,
            branchId,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          // Lưu riêng để interceptor đọc dễ hơn
          let resolvedBranchId = branchId;
          if (!resolvedBranchId) {
            resolvedBranchId = await fetchFirstBranchId(token).catch(() => undefined);
          }
          if (resolvedBranchId) {
            const nextUser = { ...user, branchId: resolvedBranchId };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
            localStorage.setItem('chips_branch_id', String(resolvedBranchId));
            setState({ user: nextUser, isAuthenticated: true, isLoading: false });
            return { success: true, user: nextUser };
          }

          localStorage.removeItem('chips_branch_id');
          setState({ user, isAuthenticated: true, isLoading: false });
          return { success: true, user };
        }

        const errMsg = json?.error_cont ?? json?.message ?? 'Tài khoản hoặc mật khẩu không đúng.';
        return { success: false, error: errMsg };
      } catch (e) {
        if (e instanceof Error && e.name !== 'TimeoutError') {
          return { success: false, error: 'Không kết nối được server.' };
        }
      }
    }

    return { success: false, error: 'Chưa cấu hình API.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('chips_branch_id');
    setState({ user: null, isAuthenticated: false, isLoading: false });
    if (state.user?.token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${state.user.token}` },
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
