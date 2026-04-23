import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, Save, X } from 'lucide-react';
import type { CartItem } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { formatPrice, products } from '../data/products';
import { ButtonLoadingContent } from './AppLoading';
import { ImageWithFallback } from './figma/ImageWithFallback';

const SIZES = [
  { id: 'S', label: 'Nhỏ', priceAdd: -5000 },
  { id: 'M', label: 'Vừa', priceAdd: 0 },
  { id: 'L', label: 'Lớn', priceAdd: 10000 },
];

const SWEETNESS_LEVELS = ['0%', '25%', '50%', '75%', '100%'];

interface CartItemEditModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CartItemEditModal({ item, isOpen, onClose }: CartItemEditModalProps) {
  const { dispatch } = useCart();
  const product = products.find((productItem) => productItem.id === item?.id) ?? null;

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSweetness, setSelectedSweetness] = useState('50%');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) return;

    const size = SIZES.find((sizeItem) => sizeItem.label === item.size || sizeItem.id === item.size);
    setSelectedSize(size?.id ?? 'M');
    setSelectedSweetness(item.sweetness || '50%');
    setQuantity(item.quantity);
    setNote(item.note ?? '');
    setIsSaving(false);
  }, [isOpen, item]);

  if (!item || !product) return null;

  const sizeAdd = SIZES.find((size) => size.id === selectedSize)?.priceAdd ?? 0;
  const sizeName = SIZES.find((size) => size.id === selectedSize)?.label ?? selectedSize;
  const itemPrice = product.price + sizeAdd;
  const totalPrice = itemPrice * quantity;

  const handleSave = () => {
    if (isSaving) return;

    setIsSaving(true);
    dispatch({
      type: 'UPDATE_ITEM',
      cartId: item.cartId,
      item: {
        ...item,
        cartId: `${product.id}-${selectedSize}-${selectedSweetness}-${note.trim()}`,
        price: itemPrice,
        quantity,
        size: sizeName,
        sweetness: selectedSweetness,
        toppings: [],
        note: note.trim() || undefined,
      },
    });
    window.setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 420);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
              <div className="relative h-56 w-full bg-[#f9fafb] sm:h-64">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9a3d0f]">
                      Chỉnh sửa món
                    </p>
                    <h2 className="text-10l font-bold leading-tight text-[#101828]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#344054]">{product.categoryLabel}</p>
                  </div>
                  <span className="shrink-0 text-xl font-bold text-[#f68749]">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-bold text-[#101828]">Kích cỡ</h3>
                    <div className="flex gap-2">
                      {SIZES.map((size) => {
                        const isActive = selectedSize === size.id;

                        return (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => setSelectedSize(size.id)}
                            className="flex flex-1 flex-col items-center justify-center rounded-xl py-3 transition-all duration-200"
                            style={{
                              backgroundColor: isActive ? '#fff4e9' : '#f9fafb',
                              border: isActive ? '1.5px solid #f68749' : '1.5px solid transparent',
                              color: isActive ? '#9a3d0f' : '#1d2939',
                            }}
                          >
                            <span className="block text-sm font-semibold">{size.label}</span>
                            <span className="block text-xs">
                              {size.priceAdd > 0
                                ? `+${formatPrice(size.priceAdd)}`
                                : size.priceAdd < 0
                                  ? formatPrice(size.priceAdd)
                                  : '\u00A0'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-end justify-between">
                      <h3 className="font-bold text-[#101828]">Độ ngọt</h3>
                      <span className="text-sm font-medium text-[#f68749]">
                        {selectedSweetness} đã chọn
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {SWEETNESS_LEVELS.map((level) => {
                        const isActive = selectedSweetness === level;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setSelectedSweetness(level)}
                            className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200"
                            style={{
                              backgroundColor: isActive ? '#fff4e9' : '#f9fafb',
                              color: isActive ? '#9a3d0f' : '#1d2939',
                              border: isActive ? '1.5px solid #f68749' : '1.5px solid transparent',
                            }}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#344054]">
                      Ghi chú cho quán
                    </h3>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#f68749] focus:ring-2 focus:ring-[#f68749]/20"
                      placeholder="Ví dụ: ít đá, không đường..."
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
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
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl py-4 font-bold text-[#ffffff] shadow-md transition-transform"
                  style={{ backgroundColor: '#f68749' }}
                >
                  
                  <span className="truncate">
                    <ButtonLoadingContent loading={isSaving} loadingText="Đang cập nhật...">
                      Cập nhật giỏ hàng - {formatPrice(totalPrice)}
                    </ButtonLoadingContent>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
