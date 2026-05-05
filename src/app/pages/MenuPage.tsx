import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, History, Home, LogOut, Menu, Minus, Plus, ShoppingBag, User, X } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { useCart } from '../contexts/CartContext';
import { useAttributes } from '../contexts/AttributesContext';
import { CATEGORIES, products, formatPrice } from '../data/products';
import type { Product } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CartSidebar } from '../components/CartSidebar';
import { ProductModal } from '../components/ProductModal';

const DEFAULT_STAFF_SIZE = 'M';
const DEFAULT_STAFF_SWEETNESS = '50%';

function getStaffCartId(productId: string) {
  return `${productId}-${DEFAULT_STAFF_SIZE}-${DEFAULT_STAFF_SWEETNESS}`;
}

export function MenuPage() {
  useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const { hasAttributes } = useAttributes();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [staffMenuOpen, setStaffMenuOpen] = useState(false);

  // Scroll to selected category and update active state
  const handleScrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Observe active category based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('category-', ''));
          }
        });
      },
      { rootMargin: '-120px 0px -60% 0px' }
    );

    CATEGORIES.forEach((c) => {
      const el = document.getElementById(`category-${c.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleDirectAdd = (product: Product, event?: React.MouseEvent) => {
    event?.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: `${product.id}-default`,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: '',
        sweetness: '',
        toppings: [],
      },
    });
  };

  const needsSelection = (product: Product) => hasAttributes && !product.skipAttributes;

  const handleQuickAdd = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.innerWidth < 768) {
      if (needsSelection(product)) {
        navigate(`/thuc-don/${product.id}`);
      } else {
        handleDirectAdd(product);
      }
    } else {
      if (needsSelection(product)) {
        setSelectedProductId(product.id);
      } else {
        handleDirectAdd(product);
      }
    }
  };

  const getStaffQuantity = (productId: string) => {
    return state.items.find((item) => item.cartId === getStaffCartId(productId))?.quantity ?? 0;
  };

  const handleStaffIncrease = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: getStaffCartId(product.id),
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: DEFAULT_STAFF_SIZE,
        sweetness: DEFAULT_STAFF_SWEETNESS,
        toppings: [],
      },
    });
  };

  const handleStaffDecrease = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    const quantity = getStaffQuantity(product.id);

    if (quantity <= 0) return;

    dispatch({
      type: 'UPDATE_QUANTITY',
      cartId: getStaffCartId(product.id),
      quantity: quantity - 1,
    });
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f9fafb' }}>
      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-0 px-4 py-3 lg:px-6 md:gap-6 md:py-8">

        {/* Mobile Header – ẩn trên desktop */}
        <div className="sticky top-0 z-30 -mx-4 mb-3 border-b border-gray-100 bg-[#f9fafb]/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101828] shadow-sm ring-1 ring-gray-100 active:scale-95"
              aria-label="Quay lại"
            >
              <ChevronLeft size={21} />
            </button>
            <img
              src="/logo.png"
              alt="Chips"
              className="absolute left-1/2 -translate-x-1/2 h-9 w-auto object-contain"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStaffMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 transition-colors hover:bg-[#fff4e9]"
                aria-label="Mở menu"
              >
                <Menu size={21} className="text-[#fb6514]" />
              </button>
              <Link
                to="/tai-khoan"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4e9] ring-1 ring-[#fb6514]/25 transition-colors hover:bg-[#ffe4d2]"
                aria-label="Tài khoản"
              >
                <User size={20} className="text-[#fb6514]" />
              </Link>
            </div>
          </div>
          {/* <p className="hidden text-sm font-medium text-[#667085]">
            {(() => {
              const h = new Date().getHours();
              if (h < 12) return 'Chào buổi sáng! Bạn muốn uống gì hôm nay? ☀️';
              if (h < 18) return 'Chào buổi chiều! Một ly trà sữa cho đỡ nắng nhé? 🧋';
              return 'Chào buổi tối! Kết thúc ngày với một ly trà sữa nào? 🌙';
            })()}
          </p> */}
        </div>

        {/* Search & Horizontal Category Navigation */}
        <div className="sticky top-[65px] z-20 bg-[#f9fafb] px-0 pb-3 pt-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:top-[80px] md:px-0 md:py-4 md:shadow-none">
          <div className="flex flex-col gap-3 mb-3 md:gap-4 md:mb-6">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm trong nhà hàng"
                className="w-full rounded-xl bg-white py-3 pl-12 pr-4 text-sm text-[#101828] outline-none focus:ring-1 focus:ring-[#fb6514] border border-gray-200 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleScrollToCategory(category.id)}
                    className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? '#f68749' : '#ffffff',
                      color: isActive ? '#ffffff' : '#344054',
                      border: isActive ? '1px solid #f68749' : '1px solid #e5e7eb'
                    }}
                  >
                    <span className="uppercase">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          <div className="flex-grow w-full min-w-0">
            <div className="mt-3 space-y-10 pb-36 md:mt-8 md:space-y-16 md:pb-0">
              {CATEGORIES.map((category) => {
                const categoryProducts = products.filter((p) => p.category === category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id} id={`category-${category.id}`} className="scroll-mt-[220px]">
                    <h2 className="mb-6 text-xl font-bold text-[#101828] md:text-2xl">
                      {category.label}
                    </h2>

                    <StaggerContainer className="flex flex-col gap-2 md:hidden" staggerDelay={0.05}>
                      {categoryProducts.map((product) => {
                        const quantity = getStaffQuantity(product.id);

                        return (
                          <StaggerItem key={product.id}>
                            <article className="flex min-h-[76px] items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
                              <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-[#f9fafb]">
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[#101828]">
                                  {product.name}
                                </h3>
                                <p className="mt-1 text-sm font-bold text-[#fb6514]">
                                  {formatPrice(product.price)}
                                </p>
                              </div>

                              {needsSelection(product) ? (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); navigate(`/thuc-don/${product.id}`); }}
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fb6514] text-white shadow-sm shadow-[#fb6514]/20 transition-transform active:scale-95"
                                  aria-label="Chọn options"
                                >
                                  <Plus size={16} />
                                </button>
                              ) : (
                                <div className="grid grid-cols-[36px_28px_36px] items-center gap-1 rounded-full bg-[#f3f4f6] p-1">
                                  <button
                                    type="button"
                                    onClick={(event) => handleStaffDecrease(product, event)}
                                    disabled={quantity === 0}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#344054] shadow-sm transition-colors disabled:cursor-not-allowed disabled:text-[#c4c4c4]"
                                    aria-label="Giảm số lượng"
                                  >
                                    <Minus size={15} />
                                  </button>
                                  <span className="text-center text-sm font-bold text-[#101828]">
                                    {quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(event) => handleStaffIncrease(product, event)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fb6514] text-white shadow-sm shadow-[#fb6514]/20 transition-transform active:scale-95"
                                    aria-label="Tăng số lượng"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              )}
                            </article>
                          </StaggerItem>
                        );
                      })}
                    </StaggerContainer>

                    <StaggerContainer
                      className="hidden gap-3 md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                      staggerDelay={0.05}
                    >
                      {categoryProducts.map((product) => (
                        <StaggerItem key={product.id}>
                          <article
                            className="group flex h-full cursor-pointer flex-col overflow-hidden bg-white border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg rounded-xl"
                            onClick={() => {
                              if (!needsSelection(product)) {
                                handleDirectAdd(product);
                                return;
                              }
                              if (window.innerWidth < 768) {
                                navigate(`/thuc-don/${product.id}`);
                              } else {
                                setSelectedProductId(product.id);
                              }
                            }}
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f9fafb]">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              {product.isNew && (
                                <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                                  MỚI
                                </span>
                              )}
                            </div>

                            <div className="flex flex-grow flex-col p-2.5 md:p-3">
                              <h3 className="mb-0.5 text-xs md:text-sm font-bold leading-tight text-[#101828] line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="mb-2 text-[10px] md:text-xs text-[#667085] line-clamp-1">
                               
                                {product.categoryLabel}
                              </p>

                              <div className="mt-auto flex items-center justify-between">
                                <span className="font-bold text-sm md:text-base text-[#101828]">
                                  {formatPrice(product.price)}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickAdd(product, e)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fb6514] text-white transition-transform duration-300 md:h-8 md:w-8 hover:scale-110 active:scale-95 shadow-md shadow-[#fb6514]/20"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </article>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="hidden w-[320px] shrink-0 lg:block">
            <div className="sticky top-[220px] h-[calc(100vh-240px)]">
              <CartSidebar />
            </div>
          </aside>
        </div>
      </main>

      {/* Floating cart bar – chỉ hiện trên mobile khi giỏ hàng có món */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 z-30 md:hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <button
              type="button"
              onClick={() => navigate('/thanh-toan')}
              className="flex w-full items-center justify-between rounded-2xl bg-[#fb6514] px-5 py-4 shadow-xl shadow-[#fb6514]/30 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white">
                  {totalItems}
                </span>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-white/80" />
                  <span className="font-bold text-white">Xem giỏ hàng</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white/90">{formatPrice(totalPrice)}</span>
                <ArrowRight size={18} className="text-white" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {staffMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.button
              type="button"
              aria-label="Đóng menu"
              className="absolute inset-0 bg-black/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStaffMenuOpen(false)}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="relative flex h-full w-[82vw] max-w-[320px] flex-col bg-white shadow-2xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                <img src="/logo.png" alt="Chips" className="h-10 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setStaffMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#101828]"
                  aria-label="Đóng menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2 px-3 py-4">
                {[
                  { to: '/', label: 'Trang chủ', icon: Home },
                  { to: '/thuc-don', label: 'Order hiện tại', icon: ShoppingBag },
                  { to: '/thanh-toan', label: 'Giỏ hàng', icon: ArrowRight },
                  { to: '/dat-hang-thanh-cong', label: 'Lịch sử đơn', icon: History },
                  { to: '/dang-nhap', label: 'Đăng xuất', icon: LogOut },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setStaffMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#1d2939] transition-colors active:bg-[#fff4e9]"
                  >
                    <Icon size={18} className="text-[#fb6514]" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-100 px-4 py-4 text-xs font-medium text-[#667085]">
                Giỏ hàng được giữ lại khi chuyển trang hoặc tải lại màn hình.
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}
