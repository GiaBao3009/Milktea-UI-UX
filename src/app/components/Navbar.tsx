import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/thuc-don', label: 'Thực đơn' },
  { href: '/tai-khoan', label: 'Hội viên' },
  { href: '/uu-dai', label: 'Ưu đãi' },
];

const ABOUT_LINKS = [
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export function Navbar() {
  const { totalItems, dispatch } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAboutOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(href + '/');

  const isAboutActive = ABOUT_LINKS.some((link) => isActive(link.href));

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 hidden md:block ${scrolled
          ? 'bg-white/82 shadow-sm shadow-emerald-900/5 backdrop-blur-2xl'
          : 'bg-white/72 backdrop-blur-xl'
          }`}
      >
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-4 md:px-8">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Fresh Bubble Tea"
              className="h-12 w-auto object-contain drop-shadow-[0_8px_18px_rgba(61,103,81,0.18)] transition-transform duration-300 group-hover:scale-[1.03] md:h-14"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#fb6514]">
                Fresh Bubble Tea
              </p>
              <p className="text-xs text-[#617067]">Tông xanh dịu. Vị trà sữa đậm hơn.</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`border-b-2 pb-1 text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive(link.href)
                  ? 'border-[#fb6514] text-[#fb6514]'
                  : 'border-transparent text-[#5c6862] hover:text-[#fb6514]'
                  }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}

            {/* About Dropdown */}
            <div ref={aboutRef} className="relative">
              <button
                type="button"
                onClick={() => setAboutOpen(!aboutOpen)}
                className={`flex items-center gap-1 border-b-2 pb-1 text-sm font-semibold tracking-wide transition-colors duration-200 ${isAboutActive
                  ? 'border-[#fb6514] text-[#fb6514]'
                  : 'border-transparent text-[#5c6862] hover:text-[#fb6514]'
                  }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Về chúng tôi
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-full mt-3 w-48 overflow-hidden rounded-2xl border border-[#e8ece8] bg-white p-2 shadow-[0_16px_48px_rgba(61,103,81,0.12)]"
                  >
                    {ABOUT_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${isActive(link.href)
                          ? 'bg-[#fff4e9] text-[#fb6514]'
                          : 'text-[#1d2939] hover:bg-[#f3f7f4]'
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dang-nhap"
              className="hidden rounded-full bg-[#eef7f1] px-4 py-2 text-sm font-semibold text-[#fb6514] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e3f2e8] md:inline-flex"
            >
              Đăng nhập
            </Link>
            {/* Cart chỉ hiện trên desktop – mobile dùng bottom nav */}
            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative hidden rounded-full p-2.5 text-[#fb6514] transition-all duration-200 hover:scale-105 hover:bg-[#fff4e9] active:scale-95 md:flex"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#fb6514] text-[10px] font-bold text-white"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </button>
            <Link
              to="/tai-khoan"
              className="hidden rounded-full p-2.5 text-[#fb6514] transition-all duration-200 hover:scale-105 hover:bg-[#fff4e9] md:inline-flex"
              aria-label="Mở trang hội viên"
            >
              <User size={22} />
            </Link>
            {/* Hamburger – chỉ hiện trên mobile */}
            <button
              type="button"
              className="rounded-full p-2.5 text-[#fb6514] transition-colors duration-200 hover:bg-[#fff4e9] md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 top-20 z-40 overflow-hidden bg-white/95 shadow-lg backdrop-blur-xl"
          >
            <div className="mx-auto max-w-[1440px] space-y-2 px-4 py-6">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.34 }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center rounded-[1.25rem] px-4 py-3 font-medium transition-colors ${isActive(link.href)
                      ? 'bg-[#fff4e9] text-[#fb6514]'
                      : 'text-[#4f5c56] hover:bg-[#f3f7f4]'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* About section in mobile */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.34 }}
              >
                <p className="mt-4 px-4 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#344054]">
                  Về chúng tôi
                </p>
              </motion.div>
              {ABOUT_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (NAV_LINKS.length + 1 + index) * 0.05, duration: 0.34 }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center rounded-[1.25rem] px-4 py-3 pl-8 font-medium transition-colors ${isActive(link.href)
                      ? 'bg-[#fff4e9] text-[#fb6514]'
                      : 'text-[#4f5c56] hover:bg-[#f3f7f4]'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
