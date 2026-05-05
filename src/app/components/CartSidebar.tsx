import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit3, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { CartItem } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../data/products';
import { CartItemEditModal } from './CartItemEditModal';
import { ImageWithFallback } from './figma/ImageWithFallback';

const PRIMARY = '#f68749';

export function CartSidebar() {
  const { state, dispatch, totalPrice } = useCart();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  return (
    <>
      <div
        className="flex h-fit max-h-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="border-b border-gray-100 bg-[#f9fafb] px-6 py-5">
          <h2 className="text-xl font-bold tracking-tight text-[#101828]">Giỏ hàng của tôi</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4e9]">
                <ShoppingBag size={28} className="text-[#f68749]" />
              </div>
              <p className="font-semibold text-[#101828]">Giỏ hàng trống</p>
              <p className="mt-1 text-sm text-[#344054]">Hãy chọn món ngon bạn nhé!</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {state.items.map((item) => (
                <motion.div
                  key={item.cartId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f9fafb]">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="relative min-w-0 flex-1">
                      <h4 className="truncate pr-16 text-sm font-bold text-[#101828]">
                        {item.name}
                      </h4>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[#344054]">
                        {item.size} · {item.sweetness}
                      </p>
                      {item.note && (
                        <p className="mt-0.5 text-[11px] italic text-[#9a3d0f]">"{item.note}"</p>
                      )}

                      <div className="absolute right-0 top-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="text-gray-400 transition-colors hover:text-[#9a3d0f]"
                          aria-label="Chỉnh sửa món"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', cartId: item.cartId })}
                          className="text-gray-400 transition-colors hover:text-red-500"
                          aria-label="Xóa món"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
                    <span className="text-sm font-bold text-[#101828]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1 rounded-md bg-[#f9fafb] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_QUANTITY',
                            cartId: item.cartId,
                            quantity: item.quantity - 1,
                          })
                        }
                        className="flex h-6 w-6 items-center justify-center rounded bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                        aria-label="Giảm số lượng"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[#101828]">
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
                        className="flex h-6 w-6 items-center justify-center rounded bg-[#fff4e9] text-[#9a3d0f] shadow-sm transition-colors hover:bg-[#ffe4d2]"
                        aria-label="Tăng số lượng"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5">
            <div className="mb-4 flex justify-between tracking-tight text-[#101828]">
              <span className="text-sm font-semibold text-[#1d2939]">Tổng số tiền</span>
              <span className="text-base font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/thanh-toan')}
              className="w-full rounded-xl py-3.5 font-bold text-[#ffffff] shadow-md transition-transform duration-200"
              style={{ backgroundColor: PRIMARY }}
            >
              Xem đơn hàng
            </motion.button>
            <p className="mt-3 px-2 text-center text-[10px] text-gray-400">
              Kiểm tra lại đơn và xác nhận thanh toán tại quầy
            </p>
          </div>
        )}
      </div>

      <CartItemEditModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />
    </>
  );
}
