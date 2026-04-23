import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Home, ShoppingBag, Tag, UtensilsCrossed, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Ẩn bottom nav trên trang chi tiết sản phẩm (trải nghiệm toàn màn hình)
  if (/^\/thuc-don\/.+/.test(location.pathname)) return null;

  // Khi floating cart bar đang hiển thị (MenuPage + có món), cart icon không cần nổi bật
  const floatingBarActive = location.pathname === '/thuc-don' && totalItems > 0;

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(href + '/');

  const leftTabs = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/thuc-don', icon: UtensilsCrossed, label: 'Thực đơn' },
  ];

  const rightTabs = [
    { href: '/uu-dai', icon: Tag, label: 'Ưu đãi' },
    { href: '/tai-khoan', icon: User, label: 'Tài khoản' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        className="border-t border-gray-100 bg-white/97 shadow-[0_-2px_20px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
      >
        <div className="flex items-end justify-around px-1 pt-2">
          {leftTabs.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <button
                key={href}
                type="button"
                onClick={() => navigate(href)}
                className="flex flex-1 flex-col items-center gap-0.5 pb-1 transition-opacity active:opacity-60"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200"
                  style={{ backgroundColor: active ? '#fff4e9' : 'transparent' }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.75}
                    style={{ color: active ? '#fb6514' : '#b0b8c1' }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold tracking-tight transition-colors duration-200"
                  style={{ color: active ? '#fb6514' : '#b0b8c1' }}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* Giỏ hàng – nổi lên khi không có floating bar, flat khi floating bar đang chiếm */}
          <button
            type="button"
            onClick={() => navigate('/thanh-toan')}
            className={`flex flex-1 flex-col items-center pb-1 transition-transform active:scale-95 ${floatingBarActive ? 'gap-0.5' : 'gap-1'}`}
          >
            {floatingBarActive ? (
              /* Flat icon – nhường sân cho floating cart bar */
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fff4e9]">
                <ShoppingBag size={20} className="text-[#fb6514]" strokeWidth={2} />
              </div>
            ) : (
              /* Nổi lên – trạng thái mặc định */
              <div className="relative -mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fb6514] shadow-lg shadow-[#fb6514]/30">
                <ShoppingBag size={22} className="text-white" strokeWidth={2} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                      className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#fb6514] ring-[1.5px] ring-[#fb6514]"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
            <span className="text-[10px] font-bold tracking-tight text-[#fb6514]">Giỏ hàng</span>
          </button>

          {rightTabs.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <button
                key={href}
                type="button"
                onClick={() => navigate(href)}
                className="flex flex-1 flex-col items-center gap-0.5 pb-1 transition-opacity active:opacity-60"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200"
                  style={{ backgroundColor: active ? '#fff4e9' : 'transparent' }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.75}
                    style={{ color: active ? '#fb6514' : '#b0b8c1' }}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold tracking-tight transition-colors duration-200"
                  style={{ color: active ? '#fb6514' : '#b0b8c1' }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
