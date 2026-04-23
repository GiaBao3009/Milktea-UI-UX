import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { formatPrice, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const SIZES = [
  { id: 'S', label: 'Nhỏ', icon: 'S', priceAdd: -5000 },
  { id: 'M', label: 'Vừa', icon: 'M', priceAdd: 0 },
  { id: 'L', label: 'Lớn', icon: 'L', priceAdd: 10000 },
];

const SWEETNESS_LEVELS = ['0%', '25%', '50%', '75%', '100%'];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === id) ?? products[0];

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSweetness, setSelectedSweetness] = useState('50%');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedSize('M');
    setSelectedSweetness('50%');
    setQuantity(1);
    setNote('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const sizeAdd = SIZES.find((s) => s.id === selectedSize)?.priceAdd ?? 0;
  const itemPrice = product.price + sizeAdd;
  const totalPrice = itemPrice * quantity;

  const handleAddToCart = () => {
    const sizeName = SIZES.find((s) => s.id === selectedSize)?.label ?? selectedSize;
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: `${product.id}-${selectedSize}-${selectedSweetness}`,
        id: product.id,
        name: product.name,
        price: itemPrice,
        image: product.image,
        quantity,
        size: sizeName,
        sweetness: selectedSweetness,
        toppings: [],
        note,
      },
    });
    // Trên mobile: quay lại trang trước (thực đơn) sau khi thêm
    if (window.innerWidth < 768) {
      navigate(-1);
    }
  };

  return (
    <div key={product.id} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#f9fafb' }}>
      <div className="mx-auto max-w-[1240px] px-0 pb-28 pt-0 md:px-12 md:pb-24 md:pt-8">

        {/* Breadcrumb – desktop only */}
        <div className="mb-8 hidden items-center gap-2 text-sm text-[#344054] md:flex">
          <Link to="/" className="transition-colors hover:text-[#fb6514]">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link to="/thuc-don" className="transition-colors hover:text-[#fb6514]">Thực đơn</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#fb6514]">{product.name}</span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 xl:gap-16">

          {/* ── LEFT: Hình ảnh sản phẩm ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:sticky lg:top-28"
          >
            <div className="relative">
              {/* Back button – mobile only, góc trên trái */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur-md transition-colors hover:bg-white active:scale-95 md:hidden"
                aria-label="Quay lại"
              >
                <ChevronLeft size={20} className="text-[#101828]" />
              </button>

              {/* Ảnh chính – single image */}
              <div className="relative w-full overflow-hidden rounded-none md:rounded-[2rem]" style={{ aspectRatio: '1 / 1' }}>
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {/* Badge – đẩy sang phải back button trên mobile */}
                {product.badge && (
                  <div
                    className="absolute z-10 rounded-full px-3 py-1.5 text-xs font-bold uppercase
                                top-3 left-[56px] md:left-5 md:top-5"
                    style={
                      product.isNew
                        ? { backgroundColor: '#ffdadb', color: '#79474b' }
                        : { backgroundColor: '#f68749', color: '#ffffff' }
                    }
                  >
                    {product.badge}
                  </div>
                )}

                {/* Rating – góc trên phải */}
                {product.rating && (
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md md:right-5 md:top-5">
                    <Star size={13} fill="#fb6514" className="text-[#fb6514]" />
                    <span className="text-sm font-bold text-[#101828]">{product.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Thông tin sản phẩm ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col px-4 md:px-0"
          >
            {/* Header sản phẩm */}
            <div className="mb-6 md:mb-8">
              <span
                className="mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
                style={{ backgroundColor: '#fff4e9', color: '#fb6514' }}
              >
                {product.categoryLabel}
              </span>
              <h1
                className="mb-3 font-bold leading-tight tracking-[-0.02em] text-[#101828]"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 3.5rem)' }}
              >
                {product.name}
              </h1>
              <p className="mb-4 text-base leading-relaxed text-[#344054] md:text-lg">
                {product.description}
              </p>
              <div className="text-2xl font-bold text-[#fb6514]">{formatPrice(product.price)}</div>
            </div>

            {/* ── Kích cỡ & Độ ngọt wrapper ── */}
            <div className="space-y-6 rounded-none md:space-y-7 md:rounded-[2rem] md:bg-[#f9fafb] md:p-7">

              {/* Kích cỡ */}
              <div>
                <h3 className="mb-3 font-bold tracking-tight text-[#101828]">Kích cỡ</h3>

                {/* Mobile: radio list */}
                <div className="space-y-2 md:hidden">
                  {SIZES.map((size) => {
                    const isActive = selectedSize === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all active:scale-[0.99]"
                        style={{
                          border: isActive ? '1.5px solid #fb6514' : '1.5px solid #e5e7eb',
                          backgroundColor: isActive ? '#fff9f5' : 'white',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#101828]">{size.label}</span>
                          {size.priceAdd !== 0 && (
                            <span className="text-sm text-[#98a2b3]">
                              ({size.priceAdd > 0 ? `+${formatPrice(size.priceAdd)}` : formatPrice(size.priceAdd)})
                            </span>
                          )}
                        </div>
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                          style={{ borderColor: isActive ? '#fb6514' : '#d0d5dd' }}
                        >
                          {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#fb6514]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop: block buttons */}
                <div className="hidden gap-3 md:flex">
                  {SIZES.map((size) => {
                    const isActive = selectedSize === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 transition-all duration-200"
                        style={{
                          backgroundColor: isActive ? '#f68749' : 'white',
                          boxShadow: isActive ? '0 2px 12px rgba(61,103,81,0.15)' : '0 1px 4px rgba(26,28,28,0.05)',
                          transform: isActive ? 'scale(1.03)' : 'scale(1)',
                        }}
                      >
                        <span className="text-xs font-semibold" style={{ color: isActive ? '#fff' : '#344054' }}>{size.label}</span>
                        <span className="text-xl font-bold" style={{ color: isActive ? '#fff' : '#1d2939' }}>{size.icon}</span>
                        <span className="text-xs font-medium" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#919e95' }}>
                          {size.priceAdd !== 0 ? (size.priceAdd > 0 ? `+${formatPrice(size.priceAdd)}` : formatPrice(size.priceAdd)) : ' '}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Độ ngọt */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold tracking-tight text-[#101828]">Độ ngọt</h3>
                  <span className="text-sm text-[#667085]">{selectedSweetness} đã chọn</span>
                </div>

                {/* Mobile: radio list */}
                <div className="space-y-2 md:hidden">
                  {SWEETNESS_LEVELS.map((level) => {
                    const isActive = selectedSweetness === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedSweetness(level)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all active:scale-[0.99]"
                        style={{
                          border: isActive ? '1.5px solid #fb6514' : '1.5px solid #e5e7eb',
                          backgroundColor: isActive ? '#fff9f5' : 'white',
                        }}
                      >
                        <span className="font-semibold text-[#101828]">{level}</span>
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                          style={{ borderColor: isActive ? '#fb6514' : '#d0d5dd' }}
                        >
                          {isActive && <span className="h-2.5 w-2.5 rounded-full bg-[#fb6514]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop: block buttons */}
                <div className="hidden gap-2 md:flex">
                  {SWEETNESS_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedSweetness(level)}
                      className="flex-1 rounded-2xl py-3 text-sm transition-all duration-200"
                      style={{
                        backgroundColor: selectedSweetness === level ? '#f68749' : 'white',
                        color: selectedSweetness === level ? '#fff' : '#1d2939',
                        fontWeight: selectedSweetness === level ? '700' : '500',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghi chú cho shop */}
              <div>
                <h3 className="mb-3 font-bold tracking-tight text-[#101828]">Ghi chú cho shop</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: ít đá, không topping, làm ngọt hơn..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#fb6514] focus:ring-2 focus:ring-[#fb6514]/20"
                />
              </div>
            </div>

            {/* Desktop: số lượng + thêm vào giỏ */}
            <div className="mt-8 hidden items-center gap-5 md:flex">
              <div className="flex items-center gap-2 rounded-full bg-[#e2e2e2] p-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#d0d5dd]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-lg font-bold text-[#101828]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#d0d5dd]"
                >
                  <Plus size={16} />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-3 rounded-full py-4 font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                style={{ background: '#fb6514', boxShadow: '0 8px 24px rgba(251,101,20,0.25)' }}
              >
                <ShoppingBag size={20} />
                <span>Thêm vào giỏ</span>
                <span className="opacity-80">- {formatPrice(totalPrice)}</span>
              </motion.button>
            </div>

            {/* Mobile: sticky bottom bar (bottom nav đã ẩn trên trang này) */}
            <div
              className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/97 px-4 pt-3 backdrop-blur-xl md:hidden"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-[#f3f4f6] p-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-[#101828]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white shadow-md active:scale-[0.98]"
                  style={{ background: '#fb6514' }}
                >
                  <ShoppingBag size={18} />
                  <span>Thêm vào giỏ</span>
                  <span className="opacity-80">· {formatPrice(totalPrice)}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
