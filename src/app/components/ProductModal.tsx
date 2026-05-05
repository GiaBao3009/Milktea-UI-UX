import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatPrice, products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useAttributes } from '../contexts/AttributesContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { ButtonLoadingContent } from './AppLoading';

interface ProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const { dispatch } = useCart();
  const { attributes, getDefaultSelections } = useAttributes();
  const product = products.find((p) => p.id === productId) || null;

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const multiAttrs = attributes.filter((a) => a.multiSelect);

  useEffect(() => {
    if (isOpen && product) {
      setSelections(getDefaultSelections(attributes));
      const multiDefaults: Record<string, string[]> = {};
      multiAttrs.forEach((attr) => { multiDefaults[attr.id] = []; });
      setMultiSelections(multiDefaults);
      setQuantity(1);
      setNote('');
      setIsAdding(false);
    }
  }, [isOpen, product, attributes]);

  if (!product) return null;

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
    if (isAdding) return;
    setIsAdding(true);

    const sizeOpt = attributes.find((a) => a.id === 'size')?.options.find((o) => o.id === selections['size']);
    const sugarOpt = attributes.find((a) => a.id === 'sugar')?.options.find((o) => o.id === selections['sugar']);

    const toppingsAttr = multiAttrs.find((a) => a.id === 'toppings');
    const selectedToppingIds = multiSelections['toppings'] ?? [];
    const selectedToppingNames = toppingsAttr?.options
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
        note: note.trim() || undefined,
      },
    });

    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
    window.setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 420);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#101828] shadow-sm backdrop-blur-md transition-colors hover:bg-white"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="relative h-64 w-full bg-[#f9fafb] sm:h-72">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold leading-tight text-[#101828]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#344054]">
                      100+ đã bán · {product.categoryLabel}
                    </p>
                  </div>
                  <span className="shrink-0 text-xl font-bold text-[#f68749]">
                    {formatPrice(itemPrice)}
                  </span>
                </div>

                <div className="space-y-6">
                  {attributes.map((attr) => {
                    const isMulti = !!attr.multiSelect;
                    return (
                      <div key={attr.id}>
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-bold text-[#101828]">{attr.name}</h3>
                          {isMulti && (
                            <span className="text-xs text-[#98a2b3]">Chọn nhiều</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {attr.options.map((opt) => {
                            const isSelected = isMulti
                              ? (multiSelections[attr.id] ?? []).includes(opt.id)
                              : selections[attr.id] === opt.id;

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  if (isMulti) {
                                    handleMultiToggle(attr.id, opt.id);
                                  } else {
                                    setSelections((prev) => ({ ...prev, [attr.id]: opt.id }));
                                  }
                                }}
                                className="flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2.5 transition-all duration-200"
                                style={{
                                  backgroundColor: isSelected ? '#fff4e9' : '#f9fafb',
                                  border: isSelected ? '1.5px solid #f68749' : '1.5px solid transparent',
                                  color: isSelected ? '#9a3d0f' : '#1d2939',
                                }}
                              >
                                <span className="block text-sm font-semibold">{opt.label}</span>
                                {opt.priceAdd !== undefined && opt.priceAdd !== 0 && (
                                  <span className="block text-xs opacity-70">
                                    {opt.priceAdd > 0 ? `+${formatPrice(opt.priceAdd)}` : formatPrice(opt.priceAdd)}
                                  </span>
                                )}
                                {isSelected && isMulti && (
                                  <Check size={11} className="mt-0.5 text-[#f68749]" strokeWidth={3} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#344054]">
                      Ghi chú cho quán
                    </h3>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#f68749] focus:ring-2 focus:ring-[#f68749]/20"
                      placeholder="Ví dụ: ít đá, không đường..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/90 p-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-6 text-center text-base font-bold text-[#101828]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff4e9] text-[#9a3d0f] transition-colors hover:bg-[#ffe4d2]"
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl py-4 font-bold text-[#101828] shadow-md transition-transform"
                  style={{ backgroundColor: '#f68749' }}
                >
                  {!isAdding && <ShoppingBag size={18} />}
                  <span className="truncate">
                    <ButtonLoadingContent loading={isAdding} loadingText="Đang thêm...">
                      Thêm vào giỏ - {formatPrice(totalPrice)}
                    </ButtonLoadingContent>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
