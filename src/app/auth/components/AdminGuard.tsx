/**
 * AdminGuard – chuyển hướng về /admin/login nếu chưa đăng nhập.
 */
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function AdminGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0f1117] text-sm font-semibold text-[#fb6514]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Đang xác thực...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
