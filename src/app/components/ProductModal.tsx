import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatPrice, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { ButtonLoadingContent } from './AppLoading';

const SIZES = [
  { id: 'S', label: 'Nhỏ', icon: 'S', priceAdd: -5000 },
  { id: 'M', label: 'Vừa', icon: 'M', priceAdd: 0 },
  { id: 'L', label: 'Lớn', icon: 'L', priceAdd: 10000 },
];

const SWEETNESS_LEVELS = ['0%', '25%', '50%', '75%', '100%'];

interface ProductModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const { dispatch } = useCart();
  const product = products.find((p) => p.id === productId) || null;

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSweetness, setSelectedSweetness] = useState('50%');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('M');
      setSelectedSweetness('50%');
      setQuantity(1);
      setNote('');
      setIsAdding(false);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const sizeAdd = SIZES.find((size) => size.id === selectedSize)?.priceAdd ?? 0;
  const itemPrice = product.price + sizeAdd;
  const totalPrice = itemPrice * quantity;

  const handleAddToCart = () => {
    if (isAdding) return;

    setIsAdding(true);
    const sizeName = SIZES.find((size) => size.id === selectedSize)?.label ?? selectedSize;

    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId: `${product.id}-${selectedSize}-${selectedSweetness}-${note.trim()}`,
        id: product.id,
        name: product.name,
        price: itemPrice,
        image: product.image,
        quantity,
        size: sizeName,
        sweetness: selectedSweetness,
        toppings: [],
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
                      100+ đã bán | {product.categoryLabel}
                    </p>
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
