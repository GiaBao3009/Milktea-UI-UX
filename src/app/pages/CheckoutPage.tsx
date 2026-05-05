import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  Banknote,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Minus,
  Plus,
  QrCode,
  ReceiptText,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import type { CartItem } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../data/products';
import { ButtonLoadingContent, FullScreenLoadingOverlay } from '../components/AppLoading';
import { CartItemEditModal } from '../components/CartItemEditModal';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type OrderType = 'dine-in' | 'takeaway';
type PaymentMethod = 'cash' | 'qr';

const PRIMARY = '#f68749';

export function CheckoutPage() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [form, setForm] = useState({
    customerName: '',
    tableCode: '',
    note: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrExpiresAt, setQrExpiresAt] = useState(() => Date.now() + 10 * 60 * 1000);
  const [remainingQrSeconds, setRemainingQrSeconds] = useState(10 * 60);
  const invoiceCode = useMemo(
    () => String(Math.floor(10000000 + Math.random() * 90000000)),
    []
  );

  const grandTotal = totalPrice;
  const needsTableCode = orderType === 'dine-in';
  const canPlaceOrder = !needsTableCode || form.tableCode.trim().length > 0;
  const checkoutModeLabel = orderType === 'dine-in' ? 'Thanh toán tại quán' : 'Thanh toán mang đi';
  const serviceModeLabel = orderType === 'dine-in' ? 'POS tại quán' : 'POS mang đi';

  const transferContent = invoiceCode;

  useEffect(() => {
    if (!isQrModalOpen) return;

    const updateRemainingTime = () => {
      setRemainingQrSeconds(Math.max(0, Math.ceil((qrExpiresAt - Date.now()) / 1000)));
    };

    updateRemainingTime();
    const interval = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(interval);
  }, [isQrModalOpen, qrExpiresAt]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || isProcessing) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    dispatch({ type: 'CLEAR_CART' });
    navigate('/dat-hang-thanh-cong');
  };

  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);

    if (method === 'qr') {
      setQrExpiresAt(Date.now() + 10 * 60 * 1000);
      setRemainingQrSeconds(10 * 60);
      setIsQrModalOpen(true);
    }
  };

  const handleRenewQr = () => {
    setQrExpiresAt(Date.now() + 10 * 60 * 1000);
    setRemainingQrSeconds(10 * 60);
  };

  if (state.items.length === 0) {
    return (
      <div
        className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f9fafb] px-6 text-center"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#fff4e9]">
          <ShoppingBag size={42} className="text-[#f68749]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#101828]">Giỏ hàng đang trống</h2>
        <p className="mb-8 max-w-sm text-sm leading-6 text-[#344054]">
          Chọn món trong thực đơn trước, sau đó tiến hành thanh toán.
        </p>
        <Link
          to="/thuc-don"
          className="rounded-xl px-8 py-3.5 font-bold text-[#101828] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          style={{ backgroundColor: PRIMARY }}
        >
          Chọn món
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f9fafb]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <main className="mx-auto w-full max-w-[1240px] px-4 py-5 md:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#344054]">
          <Link to="/" className="transition-colors hover:text-[#f68749]">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <Link to="/thuc-don" className="transition-colors hover:text-[#f68749]">
            Thực đơn
          </Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-[#f68749]">{checkoutModeLabel}</span>
        </div>

        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff4e9] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9a3d0f]">
              <Store size={14} />
              {serviceModeLabel}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#] md:text-3xl">
              Xác nhận đơn
            </h1>
          </div>
          <Link
            to="/thuc-don"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-[#f68749]/30 bg-white px-4 py-2.5 text-sm font-bold text-[#9a3d0f] transition-colors hover:bg-[#fff4e9]"
          >
            Thêm món khác
          </Link>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#101828]">Món trong đơn</h2>
                <p className="mt-1 text-sm text-[#667085]">{totalItems} ly / đơn</p>
              </div>
              <ReceiptText size={22} className="text-[#f68749]" />
            </div>

            <div className="space-y-3 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:pr-1">
              {state.items.map((item) => (
                <article
                  key={item.cartId}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-[#fcfcfd] p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 font-bold leading-snug text-[#101828]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#667085]">
                          Size {item.size} | Độ ngọt {item.sweetness}
                        </p>
                        {item.note && (
                          <p className="mt-1 text-sm font-medium text-[#9a3d0f]">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#667085] transition-colors hover:bg-[#fff4e9] hover:text-[#9a3d0f]"
                          aria-label="Chỉnh sửa món"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', cartId: item.cartId })}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#ba1a1a] transition-colors hover:bg-red-50"
                          aria-label="Xóa món"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full bg-white p-1 ring-1 ring-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              cartId: item.cartId,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#667085] transition-colors hover:bg-gray-100"
                          aria-label="Giảm số lượng"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-[#101828]">
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
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4e9] text-[#9a3d0f] transition-colors hover:bg-[#ffe4d2]"
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-[#667085]">
                          {formatPrice(item.price)} / phần
                        </p>
                        <p className="text-lg font-bold text-[#f68749]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#101828]">Thông tin đơn</h2>
                <span className="rounded-full bg-[#fff4e9] px-3 py-1 text-xs font-bold text-[#9a3d0f]">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2.5">
                <ChoiceButton
                  selected={orderType === 'dine-in'}
                  icon={<Store size={18} />}
                  label="Tại quán"
                  onClick={() => setOrderType('dine-in')}
                />
                <ChoiceButton
                  selected={orderType === 'takeaway'}
                  icon={<ShoppingBag size={18} />}
                  label="Mang đi"
                  onClick={() => setOrderType('takeaway')}
                />
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[#344054]">
                    <UserRound size={16} />
                    Tên khách
                  </span>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Ví dụ: Anh Minh"
                    className="w-full rounded-xl border border-gray-200 bg-[#fcfcfd] px-4 py-2.5 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#f68749] focus:bg-white focus:ring-2 focus:ring-[#f68749]/20"
                  />
                </label>

                {orderType === 'dine-in' && (
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-[#344054]">
                      Số bàn
                    </span>
                    <input
                      name="tableCode"
                      value={form.tableCode}
                      onChange={handleChange}
                      placeholder="Ví dụ: Bàn 05"
                      className="w-full rounded-xl border border-gray-200 bg-[#fcfcfd] px-4 py-2.5 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#f68749] focus:bg-white focus:ring-2 focus:ring-[#f68749]/20"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#344054]">
                    Ghi chú pha chế
                  </span>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ví dụ: làm trước món trà sữa truyền thống"
                    className="w-full resize-none rounded-xl border border-gray-300 bg-[#fcfcfd] px-4 py-3 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98a2b3] focus:border-[#f68749] focus:bg-white focus:ring-2 focus:ring-[#f68749]/20"
                  />
                </label>
              </div>

              <div className="my-4 border-t border-gray-100" />

              <h2 className="mb-3 text-lg font-bold text-[#101828]">Thanh toán</h2>

              <div className="mb-4 grid gap-2.5">
                <PaymentButton
                  selected={paymentMethod === 'cash'}
                  icon={<Banknote size={18} />}
                  label="Tiền mặt"
                  onClick={() => handleSelectPayment('cash')}
                />
                <PaymentButton
                  selected={paymentMethod === 'qr'}
                  icon={<QrCode size={18} />}
                  label="Chuyển khoản QR"
                  onClick={() => handleSelectPayment('qr')}
                />
                
              </div>

              <div className="mb-4 space-y-2.5 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-[#667085]">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-[#101828]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-end justify-between border-t border-dashed border-gray-200 pt-3">
                  <span className="font-bold text-[#101828]">Tổng thanh toán</span>
                  <span className="text-xl font-bold text-[#f68749]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

             

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing || !canPlaceOrder}
                className="w-full rounded-xl py-3.5 font-bold text-[#ffffff] shadow-sm transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                style={{ backgroundColor: isProcessing || !canPlaceOrder ? undefined : PRIMARY }}
              >
                <ButtonLoadingContent loading={isProcessing} loadingText="Đang xác nhận...">
                  Xác nhận đặt món
                </ButtonLoadingContent>
              </motion.button>
            </section>
          </aside>
        </div>
      </main>
      <CartItemEditModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />
      <QrPaymentModal
        isOpen={isQrModalOpen}
        amount={grandTotal}
        invoiceCode={invoiceCode}
        transferContent={transferContent}
        remainingSeconds={remainingQrSeconds}
        onClose={() => setIsQrModalOpen(false)}
        onRenew={handleRenewQr}
      />
      <FullScreenLoadingOverlay
        show={isProcessing}
        title="Đang xác nhận đơn"
        description="Hệ thống đang ghi nhận đơn và chuẩn bị chuyển sang màn hình theo dõi."
      />
    </div>
  );
}

interface ChoiceButtonProps {
  selected: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function ChoiceButton({ selected, icon, label, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all"
      style={{
        backgroundColor: selected ? '#fff4e9' : '#fcfcfd',
        border: selected ? '1.5px solid #f68749' : '1.5px solid #eaecf0',
        color: selected ? '#9a3d0f' : '#344054',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PaymentButton({ selected, icon, label, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all"
      style={{
        backgroundColor: selected ? '#fff4e9' : '#fcfcfd',
        border: selected ? '1.5px solid #f68749' : '1.5px solid #eaecf0',
      }}
    >
      <span className="flex items-center gap-3">
        <span style={{ color: selected ? '#9a3d0f' : '#667085' }}>{icon}</span>
        <span className="font-bold" style={{ color: selected ? '#9a3d0f' : '#101828' }}>
          {label}
        </span>
      </span>
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border-2"
        style={{ borderColor: selected ? '#f68749' : '#d0d5dd' }}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#f68749]" />}
      </span>
    </button>
  );
}

interface QrPaymentModalProps {
  isOpen: boolean;
  amount: number;
  invoiceCode: string;
  transferContent: string;
  remainingSeconds: number;
  onClose: () => void;
  onRenew: () => void;
}

function QrPaymentModal({
  isOpen,
  amount,
  invoiceCode,
  transferContent,
  remainingSeconds,
  onClose,
  onRenew,
}: QrPaymentModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const isExpired = remainingSeconds <= 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const remainingLabel = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.section
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-[480px] overflow-y-auto scroll-smooth rounded-2xl bg-white p-5 shadow-2xl md:p-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f9fafb] text-[#101828] transition-colors hover:bg-[#fff4e9]"
              aria-label="Đóng QR"
            >
              <X size={20} />
            </button>

            <div className="mb-5 pr-10">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e9] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9a3d0f]">
                <QrCode size={15} />
                VNPay QR
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#101828]">
                Quét mã để thanh toán
              </h2>
             
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.35 }}
              className="mx-auto mb-5 w-full max-w-[280px] rounded-2xl bg-[#fff4e9] p-4"
            >
              <MockVnpayQr expired={isExpired} />
            </motion.div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <PaymentInfoTile label="Số tiền" value={formatPrice(amount)} />
              <PaymentInfoTile label="Mã hóa đơn" value={invoiceCode} />
            </div>

            <div className="mb-4 rounded-2xl border border-[#f68749]/20 bg-[#fff4e9] p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#9a3d0f]">
                Nội dung chuyển khoản
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-lg font-bold text-[#101828]">
                  {transferContent}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(transferContent, 'content')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#9a3d0f] transition-colors hover:bg-[#ffe4d2]"
                  aria-label="Sao chép nội dung chuyển khoản"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied === 'content' && (
                <p className="mt-2 text-xs font-semibold text-[#9a3d0f]">Đã sao chép nội dung.</p>
              )}
            </div>

            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-[#fcfcfd] p-4 ring-1 ring-gray-100">
              <span className="flex items-center gap-2 text-sm font-semibold text-[#344054]">
                <Clock3 size={17} className="text-[#f68749]" />
                Thời gian hiệu lực
              </span>
              <span className="text-lg font-bold text-[#f68749]">
                {isExpired ? 'Hết hạn' : remainingLabel}
              </span>
            </div>

            <p className="mb-5 text-sm italic leading-6 text-[#9a3d0f]">
              Lưu ý: mã QR sẽ tự hết hạn sau 10 phút. Nếu quá thời gian này, vui lòng tạo lại mã
              trước khi chuyển khoản.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#f68749]/30 bg-white py-3.5 font-bold text-[#9a3d0f] transition-colors hover:bg-[#fff4e9]"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={isExpired ? onRenew : onClose}
                className="flex-1 rounded-xl py-3.5 font-bold text-white shadow-sm transition-transform hover:scale-[1.01]"
                style={{ backgroundColor: PRIMARY }}
              >
                {isExpired ? 'Tạo lại mã' : 'Đã thanh toán'}
              </button>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

interface PaymentInfoTileProps {
  label: string;
  value: string;
}

function PaymentInfoTile({ label, value }: PaymentInfoTileProps) {
  return (
    <div className="rounded-2xl bg-[#fcfcfd] p-4 ring-1 ring-gray-100">
      <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">{label}</p>
      <p className="mt-1 font-bold text-[#101828]">{value}</p>
    </div>
  );
}

function MockVnpayQr({ expired }: { expired: boolean }) {
  const blocks = [
    [8, 8], [16, 8], [24, 8], [104, 8], [144, 8], [168, 8], [184, 8],
    [56, 24], [72, 24], [88, 24], [120, 24], [152, 24],
    [8, 48], [32, 48], [64, 48], [96, 48], [112, 48], [136, 48], [176, 48],
    [48, 64], [80, 64], [128, 64], [144, 64], [160, 64],
    [16, 88], [32, 88], [56, 88], [72, 88], [104, 88], [136, 88], [168, 88],
    [8, 112], [48, 112], [80, 112], [96, 112], [120, 112], [152, 112], [184, 112],
    [32, 136], [64, 136], [112, 136], [128, 136], [160, 136],
    [8, 160], [24, 160], [72, 160], [88, 160], [120, 160], [144, 160], [176, 160],
    [56, 184], [96, 184], [128, 184], [152, 184], [168, 184], [184, 184],
  ];

  const Finder = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width="48" height="48" rx="3" fill="#101828" />
      <rect x={x + 8} y={y + 8} width="32" height="32" rx="2" fill="white" />
      <rect x={x + 16} y={y + 16} width="16" height="16" rx="1" fill="#101828" />
    </>
  );

  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#f68749]/20">
      <svg viewBox="0 0 208 208" className={expired ? 'opacity-35' : 'opacity-100'}>
        <rect width="208" height="208" fill="white" />
        <Finder x={8} y={8} />
        <Finder x={152} y={8} />
        <Finder x={8} y={152} />
        {blocks.map(([x, y], index) => (
          <rect key={`${x}-${y}-${index}`} x={x} y={y} width="10" height="10" rx="1.5" fill="#101828" />
        ))}
        <rect x="78" y="88" width="54" height="30" rx="8" fill="white" stroke="#f68749" strokeWidth="2" />
        <text x="105" y="107" textAnchor="middle" fontSize="11" fontWeight="800" fill="#f68749">
          VNPAY
        </text>
      </svg>
      {!expired && (
        <motion.div
          className="pointer-events-none absolute left-3 right-3 h-10 bg-gradient-to-b from-transparent via-[#f68749]/20 to-transparent"
          initial={{ top: 12 }}
          animate={{ top: ['12px', 'calc(100% - 52px)', '12px'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {expired && (
        <div className="absolute inset-3 flex items-center justify-center rounded-xl bg-white/72 backdrop-blur-[1px]">
          <span className="rounded-full bg-[#fff4e9] px-4 py-2 text-sm font-bold text-[#9a3d0f]">
            Mã đã hết hạn
          </span>
        </div>
      )}
    </div>
  );
}
