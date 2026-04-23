import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Edit3, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { CartItem } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { CartItemEditModal } from './CartItemEditModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const grandTotal = totalPrice;

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    navigate('/thanh-toan');
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col"
            style={{ backgroundColor: '#f9fafb', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="flex items-center justify-between bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-[#f68749]" />
                <h2 className="text-lg font-bold tracking-tight text-[#101828]">
                  Giỏ hàng
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-[#1d2939]">
                      ({totalItems} sản phẩm)
                    </span>
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="rounded-full p-2 text-[#1d2939] transition-colors hover:bg-[#f9fafb]"
                aria-label="Đóng giỏ hàng"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center py-20 text-center"
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff4e9]">
                    <ShoppingBag size={32} className="text-[#f68749]" />
                  </div>
                  <p className="mb-2 font-semibold text-[#101828]">Giỏ hàng đang trống</p>
                  <p className="text-sm text-[#1d2939]">
                    Khám phá thực đơn và thêm vài món yêu thích để bắt đầu.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'CLOSE_CART' });
                      navigate('/thuc-don');
                    }}
                    className="mt-6 rounded-full bg-[#f68749] px-6 py-3 font-medium text-[#101828] transition-transform hover:scale-[1.02]"
                  >
                    Xem thực đơn
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {state.items.map((item) => (
                    <motion.div
                      key={item.cartId}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f9fafb]">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 truncate text-sm font-semibold leading-tight text-[#101828]">
                          {item.name}
                        </h4>
                        <p className="mb-2 text-xs text-[#1d2939]">
                          {item.size} · {item.sweetness}
                          {item.toppings.length > 0 && ` · ${item.toppings.join(', ')}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#f68749]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  cartId: item.cartId,
                                  quantity: item.quantity - 1,
                                })
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f9fafb] transition-colors hover:bg-[#fff4e9]"
                              aria-label="Giảm số lượng"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-[#101828]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: 'UPDATE_QUANTITY',
                                  cartId: item.cartId,
                                  quantity: item.quantity + 1,
                                })
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f9fafb] transition-colors hover:bg-[#fff4e9]"
                              aria-label="Tăng số lượng"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#fff4e9] transition-colors hover:bg-[#ffe4d2]"
                              aria-label="Chỉnh sửa món"
                            >
                              <Edit3 size={12} className="text-[#9a3d0f]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'REMOVE_ITEM', cartId: item.cartId })}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffdad6] transition-colors hover:bg-red-200"
                              aria-label="Xóa món"
                            >
                              <Trash2 size={12} className="text-[#ba1a1a]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="bg-white px-6 py-6 shadow-[0_-8px_24px_rgba(26,28,28,0.06)]">
                <div className="mb-5 space-y-2">
                  <div className="flex justify-between text-sm text-[#1d2939]">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#1d2939]">
                    <span>Phục vụ tại quầy</span>
                    <span>0đ</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-[#f9fafb] pt-2 font-bold text-[#101828]">
                    <span>Tổng cộng</span>
                    <span className="text-[#f68749]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                  style={{ background: '#f68749' }}
                >
                  Thanh toán · {formatPrice(grandTotal)}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
          <CartItemEditModal
            item={editingItem}
            isOpen={Boolean(editingItem)}
            onClose={() => setEditingItem(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
