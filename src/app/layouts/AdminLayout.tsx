import { useState, type ChangeEvent, type ElementType } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  ClipboardList,
  // GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Shield,
  Settings,
  // userRoundCog
  SlidersHorizontal,
  Users,
  X,
  Tag,
  CalendarClock,
  // shoppingCart
  Building2,
  MonitorSmartphone,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@app/auth/contexts/AuthContext";
import { useTrans } from "@app/hooks/useTranslation";
import { BranchProvider, useBranch } from "@app/contexts/BranchContext";

const NAV_GROUPS = [
  {
    labelKey: "admin.nav.group_dashboard",
    items: [
      { href: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", labelKey: "admin.nav.analytics", icon: BarChart3 },
    ],
  },
  {
    labelKey: "admin.nav.group_operation",
    items: [
      { href: "/admin/orders", labelKey: "admin.nav.orders", icon: ShoppingBag },
      { href: "/admin/products", labelKey: "admin.nav.products", icon: Package },
      { href: "/admin/shifts", labelKey: "admin.nav.shifts", icon: CalendarClock },
      { href: "/admin/pos", labelKey: "admin.nav.pos", icon: MonitorSmartphone },
      // { href: "/admin/branches", labelKey: "admin.nav.branches", icon: GitBranch },
    ],
  },
  {
    labelKey: "admin.nav.group_system",
    items: [
      { href: "/admin/attributes", labelKey: "admin.nav.attributes", icon: Tag },
      // { href: "/admin/staff", labelKey: "admin.nav.staff", icon: Users },
      { href: "/admin/roles", labelKey: "admin.nav.roles", icon: Shield },
      { href: "/admin/account", labelKey: "admin.nav.account", icon: Settings },
      { href: "/admin/settings", labelKey: "admin.nav.settings", icon: SlidersHorizontal },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: ElementType;
  exact?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const location = useLocation();
  const active = exact
    ? location.pathname === href
    : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <Link
      to={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`group relative flex items-center rounded-lg py-2 text-xs font-extrabold tracking-[0.01em] transition-all ${collapsed ? "justify-center px-0" : "gap-2.5 px-3"
        } ${active
          ? "bg-[#00495a] text-white dark:text-slate-900 shadow-sm"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-800/50 hover:text-[#00495a]"
        }`}
    >
      <Icon
        size={17}
        strokeWidth={active ? 2.4 : 2}
        className={active ? "text-white dark:text-slate-900" : "text-slate-400 dark:text-slate-500 group-hover:text-[#00495a]"}
      />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-white px-2.5 py-1.5 text-xs font-bold text-white dark:text-slate-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </Link>
  );
}

function Sidebar({
  collapsed = false,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTrans();
  const displayName = user?.fullName || "Admin";
  const displayRole = user?.appRole || t("admin.sidebar.role_admin");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="flex h-full flex-col bg-white dark:bg-slate-800">
      <div className={`flex h-[68px] shrink-0 items-center border-b border-slate-200 dark:border-slate-700 ${collapsed ? "justify-center px-3" : "justify-center px-5"}`}>
        <div className="relative flex flex-col items-center gap-1.5 w-full">
          <img src="/logo.png" alt="Chips" className="h-7 w-auto object-contain" />
          {!collapsed && (
            <p className="text-xs font-extrabold tracking-[0.12em]">
              <span className="text-slate-900 dark:text-white">FRESH BUBBLE</span>{" "}
              <span className="text-[#fb6514]">CMS</span>
            </p>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 dark:bg-slate-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <nav className={`min-h-0 flex-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.labelKey} className={groupIndex > 0 ? "mt-6" : ""}>
            {!collapsed ? (
              <p className="mb-2.5 px-3 text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 dark:text-slate-500">
                {t(group.labelKey)}
              </p>
            ) : (
              <div className="mb-3 h-px bg-slate-100 dark:bg-slate-700" />
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={t(item.labelKey)}
                  icon={item.icon}
                  exact={item.exact}
                  collapsed={collapsed}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={`shrink-0 border-t border-slate-200 dark:border-slate-700 py-3 ${collapsed ? "px-2" : "px-4"}`}>
        <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 ${collapsed ? "p-2" : "p-3"}`}>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-xs font-extrabold text-[#fb6514]">
              {initials || "A"}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-extrabold text-slate-950 dark:text-white dark:text-slate-900">
                    {displayName}
                  </p>
                  <p className="truncate text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {displayRole}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-white dark:bg-slate-800 hover:text-red-500"
                  aria-label={t("admin.sidebar.logout")}
                  title={t("admin.sidebar.logout")}
                >
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
        </div>
        {!collapsed && <p className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          {t("admin.sidebar.powered_by")}
        </p>}
      </div>
    </aside>
  );
}

function BranchSelector() {
  const { branches, currentBranchId, currentBranch, isLoading, error, changeBranch } = useBranch();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    changeBranch(event.target.value);
  };

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <Building2 size={17} className="shrink-0 text-[#00495a] dark:text-slate-300" />
      <label htmlFor="admin-branch-selector" className="hidden text-xs font-extrabold text-slate-600 dark:text-slate-300 sm:block">
        Chi nhánh
      </label>
      <select
        id="admin-branch-selector"
        value={currentBranchId}
        onChange={handleChange}
        disabled={isLoading || branches.length === 0}
        title={error ?? currentBranch?.name ?? "Chọn chi nhánh"}
        className="min-w-0 bg-transparent text-xs font-extrabold text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400 dark:text-white"
      >
        {isLoading && <option value="">Đang tải...</option>}
        {!isLoading && branches.length === 0 && <option value="">Không có chi nhánh</option>}
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function BranchScopedOutlet() {
  const { currentBranchId, isLoading, error } = useBranch();
  if (isLoading && !currentBranchId) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-sm font-extrabold text-[#00495a]">
        Đang chuẩn bị chi nhánh mặc định...
      </div>
    );
  }

  if (error && !currentBranchId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
        Không thể tải chi nhánh mặc định: {error}
      </div>
    );
  }

  return <Outlet key={currentBranchId || "no-branch"} />;
}

function AdminLayoutShell() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { t, i18n } = useTrans();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] text-sm font-bold text-[#00495a]">
        {t("admin.layout.authenticating")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa] dark:bg-slate-900">
      <motion.div
        animate={{ width: collapsed ? 70 : 240 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="hidden h-full shrink-0 overflow-visible border-r border-slate-200 dark:border-slate-700 md:block"
      >
        <Sidebar collapsed={collapsed} />
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              className="absolute inset-0 bg-slate-950/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 34 }}
              className="relative h-full"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-800/50 md:hidden"
            >
              <Menu size={22} />
            </button>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-800/50 md:flex"
              onClick={() => setCollapsed((value) => !value)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <BranchSelector />
          </div>

          {/* <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-800/50 transition-colors"
            >
              <span className="text-[16px] leading-none">
                {i18n.language === "vi" ? "🇻🇳" : "🇺🇸"}
              </span>
              <span className="hidden sm:inline">
                {i18n.language === "vi" ? "Tiếng Việt" : "English"}
              </span>
            </button>
          </div> */}
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f4f7fa] dark:bg-slate-900 px-4 py-5 sm:px-5 lg:px-6 xl:px-7 xl:py-7">
          <BranchScopedOutlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <BranchProvider>
      <AdminLayoutShell />
    </BranchProvider>
  );
}
