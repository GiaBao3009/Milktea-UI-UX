import { useEffect } from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router';
import { CartDrawer } from './components/CartDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Navbar } from './components/Navbar';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { AboutPage } from './pages/AboutPage';
import { PageTransitionLoader } from './components/AppLoading';
import { AuthPage } from './pages/AuthPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/MenuPage';
import { NewsPage } from './pages/NewsPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { VoucherPage } from './pages/VoucherPage';
import { Toaster } from './components/ui/sonner';
// Admin pages
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { OrderManagement } from './admin/OrderManagement';
import { MenuManagement } from './admin/MenuManagement';
import { CustomerManagement } from './admin/CustomerManagement';
import { VoucherManagement } from './admin/VoucherManagement';
import { Reports } from './admin/Reports';
import { BranchManagement } from './admin/BranchManagement';
import { StaffManagement } from './admin/StaffManagement';
import { AuditLog } from './admin/AuditLog';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// ── Customer layout ───────────────────────────────────────────────────────────
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
        Có thể đường dẫn đã thay đổi trong lúc giao diện mới của Fresh Bubble Tea được hoàn thiện.
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

// ── Admin layout (có guard tích hợp, redirect về /dang-nhap nếu chưa login) ──
function AdminProtectedLayout() {
  return (
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Customer routes — /dang-nhap là điểm đăng nhập cho tất cả (kể cả admin)
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

  // Admin routes — guard redirect về /dang-nhap nếu chưa đăng nhập
  {
    path: '/admin',
    Component: AdminProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'orders', Component: OrderManagement },
      { path: 'products', Component: MenuManagement },
      { path: 'customers', Component: CustomerManagement },
      { path: 'vouchers', Component: VoucherManagement },
      { path: 'analytics', Component: Reports },
      { path: 'branches', Component: BranchManagement },
      { path: 'staff', Component: StaffManagement },
      { path: 'audit', Component: AuditLog },
    ],
  },
]);
