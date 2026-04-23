import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Bell, Plus, ShoppingBag, User } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';
import { useCart } from '../context/CartContext';
import { CATEGORIES, products, formatPrice } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CartSidebar } from '../components/CartSidebar';
import { ProductModal } from '../components/ProductModal';

export function MenuPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || 'all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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

  const handleQuickAdd = (product: any, event: React.MouseEvent) => {
    event.stopPropagation();
    // Mobile: điều hướng sang trang chi tiết thay vì popup
    if (window.innerWidth < 768) {
      navigate(`/thuc-don/${product.id}`);
    } else {
      setSelectedProductId(product.id);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f9fafb' }}>
      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-0 px-4 py-3 lg:px-6 md:gap-6 md:py-8">

        {/* Mobile Header – ẩn trên desktop */}
        <div className="mb-3 md:hidden">
          <div className="flex items-center justify-between mb-2">
            <img src="/logo.png" alt="Chips" className="h-9 w-auto object-contain" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 transition-colors hover:bg-[#fff4e9]"
                aria-label="Thông báo"
              >
                <Bell size={20} className="text-[#fb6514]" />
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
          <p className="text-sm font-medium text-[#667085]">
            {(() => {
              const h = new Date().getHours();
              if (h < 12) return 'Chào buổi sáng! Bạn muốn uống gì hôm nay? ☀️';
              if (h < 18) return 'Chào buổi chiều! Một ly trà sữa cho đỡ nắng nhé? 🧋';
              return 'Chào buổi tối! Kết thúc ngày với một ly trà sữa nào? 🌙';
            })()}
          </p>
        </div>

        {/* Search & Horizontal Category Navigation */}
        <div className="sticky top-0 z-20 bg-[#f9fafb] px-0 pb-3 pt-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:top-[80px] md:px-0 md:py-4 md:shadow-none">
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
            <div className="space-y-10 mt-3 md:space-y-16 md:mt-8">
              {CATEGORIES.map((category) => {
                const categoryProducts = products.filter((p) => p.category === category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id} id={`category-${category.id}`} className="scroll-mt-[220px]">
                    <h2 className="mb-6 text-xl font-bold text-[#101828] md:text-2xl">
                      {category.label}
                    </h2>

                    <StaggerContainer
                      className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                      staggerDelay={0.05}
                    >
                      {categoryProducts.map((product) => (
                        <StaggerItem key={product.id}>
                          <article
                            className="group flex h-full cursor-pointer flex-col overflow-hidden bg-white border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg rounded-xl"
                            onClick={() => {
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
            className="fixed bottom-[76px] left-4 right-4 z-30 md:hidden"
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

      <ProductModal
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}
