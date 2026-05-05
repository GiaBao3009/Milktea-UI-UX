import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { formatPrice, products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAttributes } from '../contexts/AttributesContext';
import type { ProductAttribute } from '../contexts/AttributesContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ── Unified tappable row — same look for single-select AND multi-select ────────
function OptionRow({
  label,
  detail,
  isSelected,
  onClick,
}: {
  label: string;
  detail?: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all active:scale-[0.99]"
      style={{
        border: isSelected ? '1.5px solid #fb6514' : '1.5px solid #e5e7eb',
        backgroundColor: isSelected ? '#fff9f5' : 'white',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#101828]">{label}</span>
        {detail && <span className="text-sm text-[#98a2b3]">{detail}</span>}
      </div>
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all"
        style={{
          background: isSelected ? '#fb6514' : 'transparent',
          border: `2px solid ${isSelected ? '#fb6514' : '#d0d5dd'}`,
        }}
      >
        {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const { attributes, getDefaultSelections } = useAttributes();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === id) ?? products[0];

  // single-select: attrId → optionId
  const [selections, setSelections] = useState<Record<string, string>>({});
  // multi-select: attrId → optionId[]
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const singleAttrs = attributes.filter((a) => !a.multiSelect);
  const multiAttrs = attributes.filter((a) => a.multiSelect);

  useEffect(() => {
    setSelections(getDefaultSelections(attributes));
    const multiDefaults: Record<string, string[]> = {};
    multiAttrs.forEach((attr) => { multiDefaults[attr.id] = []; });
    setMultiSelections(multiDefaults);
    setQuantity(1);
    setNote('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, attributes]);

  const priceAdd = attributes.reduce((sum, attr) => {
    if (attr.multiSelect) {
      const ids = multiSelections[attr.id] ?? [];
      return sum + attr.options
        .filter((o) => ids.includes(o.id))
        .reduce((s, o) => s + (o.priceAdd ?? 0), 0);
    }
    const opt = attr.options.find((o) => o.id === selections[attr.id]);
    return sum + (opt?.priceAdd ?? 0);
  }, 0);

  const itemPrice = product.price + priceAdd;
  const totalPrice = itemPrice * quantity;

  const handleSingleSelect = (attrId: string, optId: string) => {
    setSelections((prev) => ({ ...prev, [attrId]: optId }));
  };

  const handleMultiToggle = (attrId: string, optId: string) => {
    setMultiSelections((prev) => {
      const current = prev[attrId] ?? [];
      return {
        ...prev,
        [attrId]: current.includes(optId)
          ? current.filter((id) => id !== optId)
          : [...current, optId],
      };
    });
  };

  const handleAddToCart = () => {
    const sizeOpt = singleAttrs
      .find((a) => a.id === 'size')
      ?.options.find((o) => o.id === selections['size']);
    const sugarOpt = singleAttrs
      .find((a) => a.id === 'sugar')
      ?.options.find((o) => o.id === selections['sugar']);

    const selectedToppingIds = multiSelections['toppings'] ?? [];
    const toppingsAttr = multiAttrs.find((a) => a.id === 'toppings');
    const selectedToppingNames =
      toppingsAttr?.options
        .filter((o) => selectedToppingIds.includes(o.id))
        .map((o) => o.label) ?? [];

    const selStr = [
      ...Object.entries(selections).map(([k, v]) => `${k}:${v}`),
      ...Object.entries(multiSelections)
        .filter(([, v]) => v.length > 0)
        .map(([k, v]) => `${k}:${v.join(',')}`),
    ].join('-');

    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: `${product.id}-${selStr}-${note.trim()}`,
        id: product.id,
        name: product.name,
        price: itemPrice,
        image: product.image,
        quantity,
        size: sizeOpt?.label ?? '',
        sweetness: sugarOpt?.label ?? '',
        toppings: selectedToppingNames,
        note,
      },
    });
    if (window.innerWidth < 768) {
      navigate(-1);
    }
  };

  // ── Shared renderer for one attribute section ──────────────────────────────
  const renderAttr = (attr: ProductAttribute) => {
    const isMulti = !!attr.multiSelect;

    const getDetail = (priceAdd?: number) => {
      if (!priceAdd) return undefined;
      return `(${priceAdd > 0 ? '+' : ''}${formatPrice(priceAdd)})`;
    };

    return (
      <div key={attr.id}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold tracking-tight text-[#101828]">{attr.name}</h3>
          {isMulti && (
            <span className="text-xs text-[#98a2b3]">Chọn nhiều</span>
          )}
        </div>

        {/* ── Mobile: unified tappable rows (OptionRow) ── */}
        <div className="space-y-2 md:hidden">
          {attr.options.map((opt) => {
            const isSelected = isMulti
              ? (multiSelections[attr.id] ?? []).includes(opt.id)
              : selections[attr.id] === opt.id;
            return (
              <OptionRow
                key={opt.id}
                label={opt.label}
                detail={getDetail(opt.priceAdd)}
                isSelected={isSelected}
                onClick={() =>
                  isMulti
                    ? handleMultiToggle(attr.id, opt.id)
                    : handleSingleSelect(attr.id, opt.id)
                }
              />
            );
          })}
        </div>

        {/* ── Desktop: compact tile buttons for single-select ── */}
        {!isMulti && (
          <div className="hidden flex-wrap gap-2 md:flex">
            {attr.options.map((opt) => {
              const isSelected = selections[attr.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSingleSelect(attr.id, opt.id)}
                  className="flex flex-col items-center justify-center rounded-2xl px-4 py-3 transition-all duration-200"
                  style={{
                    backgroundColor: isSelected ? '#f68749' : 'white',
                    boxShadow: isSelected
                      ? '0 2px 12px rgba(246,135,73,0.25)'
                      : '0 1px 4px rgba(26,28,28,0.05)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: isSelected ? '#fff' : '#1d2939' }}
                  >
                    {opt.label}
                  </span>
                  {opt.priceAdd !== undefined && opt.priceAdd !== 0 && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#919e95' }}
                    >
                      {opt.priceAdd > 0 ? `+${formatPrice(opt.priceAdd)}` : formatPrice(opt.priceAdd)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Desktop: 2-column grid of OptionRows for multi-select ── */}
        {isMulti && (
          <div className="hidden grid-cols-2 gap-2 md:grid">
            {attr.options.map((opt) => {
              const isSelected = (multiSelections[attr.id] ?? []).includes(opt.id);
              return (
                <OptionRow
                  key={opt.id}
                  label={opt.label}
                  detail={getDetail(opt.priceAdd)}
                  isSelected={isSelected}
                  onClick={() => handleMultiToggle(attr.id, opt.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
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

          {/* ── LEFT: Hình ảnh ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:sticky lg:top-28"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur-md transition-colors hover:bg-white active:scale-95 md:hidden"
                aria-label="Quay lại"
              >
                <ChevronLeft size={20} className="text-[#101828]" />
              </button>

              <div className="relative w-full overflow-hidden rounded-none md:rounded-[2rem]" style={{ aspectRatio: '1 / 1' }}>
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {product.badge && (
                  <div
                    className="absolute z-10 rounded-full px-3 py-1.5 text-xs font-bold uppercase top-3 left-[56px] md:left-5 md:top-5"
                    style={
                      product.isNew
                        ? { backgroundColor: '#ffdadb', color: '#79474b' }
                        : { backgroundColor: '#f68749', color: '#ffffff' }
                    }
                  >
                    {product.badge}
                  </div>
                )}

                {product.rating && (
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md md:right-5 md:top-5">
                    <Star size={13} fill="#fb6514" className="text-[#fb6514]" />
                    <span className="text-sm font-bold text-[#101828]">{product.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Chi tiết + lựa chọn ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col px-4 md:px-0"
          >
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
              <div className="text-2xl font-bold text-[#fb6514]">{formatPrice(itemPrice)}</div>
            </div>

            {/* ── Attribute sections – hidden when skipAttributes ── */}
            {!product.skipAttributes && attributes.length > 0 && (
              <div className="space-y-6 rounded-none md:space-y-7 md:rounded-[2rem] md:bg-[#f9fafb] md:p-7">
                {attributes.map(renderAttr)}
              </div>
            )}

            {product.skipAttributes && (
              <div
                className="rounded-2xl px-5 py-4 text-sm text-[#667085]"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
              >
                Sản phẩm đóng gói sẵn — không tuỳ chỉnh được.
              </div>
            )}

            {/* Desktop: qty + add to cart */}
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

            {/* Mobile: sticky bottom bar */}
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
