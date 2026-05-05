import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingCart, X, Plus, Minus, Trash2, Banknote,
  QrCode, Loader2, ChevronLeft, CheckCircle2, Tag,
  Minus as MinusIcon, Coffee, CreditCard, Receipt,
} from 'lucide-react';
import { toast } from 'sonner';
import { productService, type Product, type Category } from '@app/modules/product-catalog/services/productService';

/* ─── Types ─── */
interface OrderItem {
  uid: string;
  product: Product;
  size: string;
  price: number;
  quantity: number;
  notes: string;
}

type PaymentMethod = 'CASH' | 'VNPAY';
type ViewMode = 'products' | 'order';

/* ─── Helpers ─── */
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

/* ─── Sub-components ─── */
function CategoryTab({ name, active, onClick }: { name: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${active
        ? 'bg-primary text-primary-foreground shadow-md'
        : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`}
    >
      {name}
    </motion.button>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product, size: string, price: number) => void }) {
  const defaultSize = product.sizes[0];
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,73,90,0.12)' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => defaultSize && onAdd(product, defaultSize.size, defaultSize.price)}
      className="bg-card border border-border rounded-2xl p-3 cursor-pointer group overflow-hidden"
    >
      {/* Image / placeholder */}
      <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-secondary overflow-hidden mb-3">
        {product.imageUrl || product.image ? (
          <img src={product.imageUrl ?? product.image} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Coffee className="w-10 h-10 text-primary/30" />
          </div>
        )}
        {/* Quick add */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{product.name}</h4>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary">{defaultSize ? fmt(defaultSize.price) : '—'}</span>
        {product.sizes.length > 1 && (
          <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
            {product.sizes.length} size
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Size Picker Modal ─── */
function SizePickerModal({
  product,
  onConfirm,
  onClose,
}: {
  product: Product | null;
  onConfirm: (p: Product, size: string, price: number) => void;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]?.size ?? '');
      setNotes('');
    }
  }, [product]);

  if (!product) return null;
  const price = product.sizes.find((s) => s.size === selectedSize)?.price ?? 0;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex sm:items-center sm:justify-center p-4 pointer-events-none"
          >
            <div className="bg-card rounded-2xl w-full max-w-sm border border-border shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold">{product.name}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Chọn Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${selectedSize === s.size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/40'
                          }`}
                      >
                        {s.size} · {fmt(s.price)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Ghi chú</p>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ít đường, nhiều đá..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-border flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { onConfirm(product, selectedSize, price); onClose(); }}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm · {fmt(price)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Payment Modal ─── */
function PaymentModal({
  total,
  method,
  setMethod,
  cashInput,
  setCashInput,
  onConfirm,
  onClose,
  loading,
}: {
  total: number;
  method: PaymentMethod;
  setMethod: (m: PaymentMethod) => void;
  cashInput: number;
  setCashInput: (n: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const change = cashInput - total;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-card rounded-2xl w-full max-w-md border border-border shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-bold text-lg flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> Thanh toán</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-5 space-y-4">
            {/* Total */}
            <div className="bg-primary/8 rounded-2xl p-4 text-center border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Tổng thanh toán</p>
              <p className="text-3xl font-black text-primary">{fmt(total)}</p>
            </div>

            {/* Method selector */}
            <div>
              <p className="text-sm font-semibold mb-2">Phương thức thanh toán</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'CASH', icon: Banknote, label: 'Tiền mặt' },
                  { id: 'VNPAY', icon: QrCode, label: 'VNPay / QR' },
                ] as const).map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${method === id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'
                      }`}
                  >
                    <Icon className="w-5 h-5" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash input */}
            {method === 'CASH' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Tiền khách đưa</label>
                  <input
                    type="number"
                    step="1000"
                    value={cashInput}
                    onChange={(e) => setCashInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                  />
                </div>
                {/* Quick amounts */}
                <div className="flex flex-wrap gap-2">
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <button key={amt} onClick={() => setCashInput(amt)}
                      className="px-3 py-1.5 bg-secondary rounded-lg text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                  <button onClick={() => setCashInput(total)}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    Đúng tiền
                  </button>
                </div>
                {cashInput > 0 && (
                  <div className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${change >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    <span>Tiền thối lại</span>
                    <span>{change >= 0 ? fmt(change) : 'Thiếu ' + fmt(Math.abs(change))}</span>
                  </div>
                )}
              </motion.div>
            )}

            {method === 'VNPAY' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2 p-4 bg-secondary/40 rounded-xl border border-border"
              >
                <div className="w-32 h-32 bg-white rounded-xl border border-border flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-primary/30" />
                </div>
                <p className="text-xs text-muted-foreground text-center">QR code sẽ hiển thị sau khi tạo đơn</p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3 p-5 border-t border-border">
            <button onClick={onClose} className="flex-1 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              disabled={loading || (method === 'CASH' && cashInput < total)}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main POS Page ─── */
export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [mobileView, setMobileView] = useState<ViewMode>('products');

  // Size picker
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);

  // Payment
  const [showPayment, setShowPayment] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('CASH');
  const [cashInput, setCashInput] = useState(0);
  const [paying, setPaying] = useState(false);

  // Success overlay
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cats, prods] = await Promise.all([productService.getCategories(), productService.getProducts()]);
        const allCat: Category = { id: '', name: 'Tất cả', status: 'active' };
        setCategories([allCat, ...cats]);
        setProducts(prods);
      } catch {
        toast.error('Không tải được sản phẩm');
      } finally {
        setLoading(false);
      }
    })();

    // Lệnh này không làm gì cả, chỉ có tác dụng "kích nổ" cho trình duyệt 
    // đi tải sẵn danh sách giọng nói về từ lúc web mới mở lên.
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();

      // Đề phòng Chrome bị lười, ép nó load khi có sự thay đổi
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const addItem = (product: Product, size: string, price: number) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      if (existing) return prev.map((i) => i.uid === existing.uid ? { ...i, quantity: i.quantity + 1 } : i);
      const uid = `${product.id}-${size}-${Date.now()}`;
      return [...prev, { uid, product, size, price, quantity: 1, notes: '' }];
    });
    if (window.innerWidth < 768) setMobileView('order');
  };

  const updateQty = (uid: string, delta: number) => {
    setOrderItems((prev) =>
      prev.flatMap((i) => {
        if (i.uid !== uid) return [i];
        const next = i.quantity + delta;
        return next <= 0 ? [] : [{ ...i, quantity: next }];
      })
    );
  };

  const removeItem = (uid: string) => setOrderItems((prev) => prev.filter((i) => i.uid !== uid));
  const clearOrder = () => setOrderItems([]);

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const openPayment = () => {
    if (orderItems.length === 0) { toast.error('Chưa có sản phẩm trong đơn'); return; }
    setCashInput(subtotal);
    setShowPayment(true);
  };

  const confirmPayment = async () => {
    // 1. Lách luật trình duyệt: Phát âm thanh ngay lập tức thông báo đang xử lý
    if ('speechSynthesis' in window) {
      // Xóa các câu đọc cũ đang kẹt (nếu có)
      window.speechSynthesis.cancel();
      const uInit = new SpeechSynthesisUtterance("Đang xử lý giao dịch");
      uInit.lang = 'vi-VN';
      uInit.rate = 0.9; // Chỉnh tốc độ hơi chậm lại chút cho sang
      window.speechSynthesis.speak(uInit);
    }

    try {
      setPaying(true);
      await new Promise((r) => setTimeout(r, 800)); // simulate API
      const num = '#' + Math.floor(10000 + Math.random() * 90000);
      setOrderNumber(num);
      setShowPayment(false);
      setOrderSuccess(true);
      clearOrder();

      // 2. NẾU THÀNH CÔNG: Xử lý chuỗi tiền và phát âm thanh thành công
      if ('speechSynthesis' in window) {
        // Logic fix lại vụ lặp từ "đồng"
        const amountText = subtotal >= 1000 && subtotal % 1000 === 0
          ? `${subtotal / 1000} nghìn đồng`
          : `${subtotal} đồng`;

        const uSuccess = new SpeechSynthesisUtterance(`Thanh toán thành công ${amountText}`);
        uSuccess.lang = 'vi-VN';
        uSuccess.rate = 0.9;
        window.speechSynthesis.speak(uSuccess);
      }

    } catch {
      toast.error('Thanh toán thất bại');

      // 3. NẾU THẤT BẠI: Thông báo thất bại
      if ('speechSynthesis' in window) {
        const uFail = new SpeechSynthesisUtterance("Giao dịch thất bại, vui lòng thử lại");
        uFail.lang = 'vi-VN';
        uFail.rate = 0.9;
        window.speechSynthesis.speak(uFail);
      }
    } finally {
      setPaying(false);
    }
  };

  const itemCount = orderItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex h-screen bg-[#f4f7fa] dark:bg-slate-900 overflow-hidden flex-col">
      {/* Top bar */}
      <header className="shrink-0 h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 gap-3 shadow-sm">
        <a href="/admin" className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Về Admin
        </a>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-bold text-green-600 hidden sm:inline">Ca đang mở</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 rounded-xl">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">POS Terminal</span>
          </div>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex md:hidden bg-secondary rounded-xl p-1 gap-1">
          {(['products', 'order'] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setMobileView(v)}
              className={`relative px-3 py-1 rounded-lg text-xs font-bold transition-all ${mobileView === v ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-muted-foreground'}`}
            >
              {v === 'products' ? 'Sản phẩm' : 'Đơn hàng'}
              {v === 'order' && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── LEFT: Product catalog ─── */}
        <div className={`flex flex-col flex-1 min-w-0 overflow-hidden ${mobileView === 'order' ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="shrink-0 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên sản phẩm..."
                className="w-full pl-9 pr-4 py-2.5 bg-secondary/60 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus:ring-0 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="shrink-0 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {categories.map((c) => (
              <CategoryTab key={c.id} name={c.name} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)} />
            ))}
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-muted-foreground">
                <Coffee className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-semibold">Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35 }}
                  >
                    <ProductCard
                      product={p}
                      onAdd={(prod) => prod.sizes.length > 1 ? setPickerProduct(prod) : addItem(prod, prod.sizes[0].size, prod.sizes[0].price)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Order panel ─── */}
        <div className={`flex flex-col w-full md:w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-hidden ${mobileView === 'products' ? 'hidden md:flex' : 'flex'}`}>
          {/* Order header */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">Đơn hàng</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 bg-primary text-primary-foreground text-[11px] font-black rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            {orderItems.length > 0 && (
              <button onClick={clearOrder} className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" /> Xoá tất cả
              </button>
            )}
          </div>

          {/* Order items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {orderItems.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-semibold text-sm">Chưa có sản phẩm</p>
                <p className="text-xs mt-1">Chọn sản phẩm từ danh sách bên trái</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {orderItems.map((item) => (
                  <motion.div key={item.uid}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 p-3 bg-secondary/30 rounded-xl border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Size {item.size} · {fmt(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => updateQty(item.uid, -1)} className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.uid, 1)} className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.uid)} className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center ml-0.5">
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Order footer */}
          <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-white dark:bg-slate-800">
            {orderItems.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính ({itemCount} món)</span>
                  <span className="font-semibold">{fmt(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="text-xl font-black text-primary">{fmt(subtotal)}</span>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
              onClick={openPayment}
              disabled={orderItems.length === 0}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              {orderItems.length === 0 ? 'Thêm sản phẩm để thanh toán' : `Thanh toán · ${fmt(subtotal)}`}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Size picker modal */}
      {pickerProduct && (
        <SizePickerModal
          product={pickerProduct}
          onConfirm={(p, size, price) => addItem(p, size, price)}
          onClose={() => setPickerProduct(null)}
        />
      )}

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            total={subtotal}
            method={payMethod}
            setMethod={setPayMethod}
            cashInput={cashInput}
            setCashInput={setCashInput}
            onConfirm={confirmPayment}
            onClose={() => setShowPayment(false)}
            loading={paying}
          />
        )}
      </AnimatePresence>

      {/* Order success overlay */}
      <AnimatePresence>
        {orderSuccess && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-3xl p-8 w-full max-w-sm text-center border border-border shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-black text-green-600 mb-1">Thanh toán thành công!</h3>
                <p className="text-muted-foreground text-sm mb-2">Đơn hàng đã được tạo</p>
                <div className="text-3xl font-black text-primary my-4">{orderNumber}</div>
                <p className="text-sm text-muted-foreground mb-6">Đưa hoá đơn cho khách hàng</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOrderSuccess(false)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                  Đơn tiếp theo
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
