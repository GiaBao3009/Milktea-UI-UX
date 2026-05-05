import { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router';
import { CartDrawer } from '@app/components/CartDrawer';
import { MobileBottomNav } from '@app/components/MobileBottomNav';
import { Navbar } from '@app/components/Navbar';
import { CartProvider } from '@app/contexts/CartContext';
import { AuthProvider } from '@app/auth/contexts/AuthContext';
import { AdminGuard } from '@app/auth/components/AdminGuard';
import { AboutPage } from '@app/pages/AboutPage';
import { PageTransitionLoader } from '@app/components/AppLoading';
import { AuthPage } from '@app/pages/AuthPage';
import { CheckoutPage } from '@app/pages/CheckoutPage';
import { ContactPage } from '@app/pages/ContactPage';
import { HomePage } from '@app/pages/HomePage';
import { LoginPage } from '@app/pages/LoginPage';
import { MenuPage } from '@app/pages/MenuPage';
import { NewsPage } from '@app/pages/NewsPage';
import { OrderSuccessPage } from '@app/pages/OrderSuccessPage';
import { ProductDetailPage } from '@app/pages/ProductDetailPage';
import { VoucherPage } from '@app/pages/VoucherPage';
import { Toaster } from '@app/components/ui/sonner';
// Admin layout
import { AdminLayout } from '@app/layouts/AdminLayout';
// Admin pages
import AdminDashboard from '@app/modules/admin/DashboardPage';
import AdminOrders from '@app/modules/admin/OrdersPage';
import AdminProducts from '@app/modules/admin/ProductsPage';
import AdminReports from '@app/modules/admin/ReportsPage';
import AdminBranches from '@app/modules/admin/BranchesPage';
import AdminUsers from '@app/modules/admin/UsersPage';
import AdminRoles from '@app/modules/admin/RolesPage';
import AdminAccount from '@app/modules/admin/AccountPage';
import AdminSystemSettings from '@app/modules/admin/SystemSettingsPage';
import AdminAttributes from '@app/modules/admin/AttributesPage';
import AdminShiftSessions from '@app/modules/admin/ShiftSessionsPage';
import AdminPOS from '@app/modules/admin/POSPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function RootLayout() {
  const location = useLocation();
  const isOrderMenu = location.pathname === '/thuc-don';
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" richColors />
        <div
          className="flex min-h-screen flex-col"
          style={{
            backgroundColor: '#f9fafb',
            backgroundImage:
              'radial-gradient(circle at top left, rgba(168,213,186,0.22), transparent 24%), radial-gradient(circle at bottom right, rgba(232,245,236,0.85), transparent 28%)',
          }}
        >
          <ScrollToTop />
          <PageTransitionLoader />
          <Navbar />
          <CartDrawer />
          <div className={`flex-grow ${isOrderMenu ? 'pb-0' : 'pb-20 md:pb-0'}`}>
            <Outlet />
          </div>
          <MobileBottomNav />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

function NotFoundPage() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <span className="mb-4 rounded-full bg-[#fff4e9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#fb6514]">
        Fresh Bubble Tea
      </span>
      <h1 className="mb-4 text-6xl font-bold text-[#fb6514]">404</h1>
      <p className="mb-2 text-xl font-semibold text-[#101828]">Trang này không tồn tại.</p>
      <p className="mb-8 text-[#52605a]">
        Có thể đường dẫn đã thay đổi trong lúc giao diện mới được hoàn thiện.
      </p>
      <a
        href="/"
        className="rounded-full bg-[#fb6514] px-8 py-4 font-bold text-white transition-transform hover:scale-[1.02]"
      >
        Về trang chủ
      </a>
    </div>
  );
}

function AdminNotFound() {
  return <Navigate to="/admin" replace />;
}

function AdminProtectedLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'thuc-don', Component: MenuPage },
      { path: 'thuc-don/:id', Component: ProductDetailPage },
      { path: 'thanh-toan', Component: CheckoutPage },
      { path: 'dat-hang-thanh-cong', Component: OrderSuccessPage },
      { path: 'tai-khoan', Component: AuthPage },
      { path: 'dang-nhap', Component: LoginPage },
      { path: 'uu-dai', Component: VoucherPage },
      { path: 'gioi-thieu', Component: AboutPage },
      { path: 'tin-tuc', Component: NewsPage },
      { path: 'lien-he', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    path: '/admin',
    Component: AdminProtectedLayout,
    children: [
      // Public admin route – không cần guard
      { path: 'login', Component: LoginPage },
      // Protected admin routes
      {
        Component: AdminGuard,
        children: [
          // POS – full screen, no admin sidebar
          { path: 'pos', Component: AdminPOS },
          {
            Component: AdminLayout,
            children: [
              { index: true, Component: AdminDashboard },
              { path: 'orders', Component: AdminOrders },
              { path: 'products', Component: AdminProducts },
              { path: 'analytics', Component: AdminReports },
              { path: 'branches', Component: AdminBranches },
              { path: 'staff', Component: AdminUsers },
              { path: 'roles', Component: AdminRoles },
              { path: 'attributes', Component: AdminAttributes },
              { path: 'shifts', Component: AdminShiftSessions },
              { path: 'account', Component: AdminAccount },
              { path: 'settings', Component: AdminSystemSettings },
              { path: '*', Component: AdminNotFound },
            ],
          },
        ],
      },
    ],
  },
]);
