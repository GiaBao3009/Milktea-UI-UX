import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, Play, Square, X, Loader2, Banknote, TrendingUp,
  ShoppingBag, CalendarClock, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Timer, Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  shiftSessionService,
  type ShiftSession,
  type OpenShiftPayload,
  type CloseShiftPayload,
} from '@app/modules/system/services/shiftSessionService';
import { branchService, type Branch } from '@app/modules/system/services/branchService';

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });

const fmtDuration = (start: string, end?: string) => {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}g ${m}p`;
};

export default function ShiftSessionsPage() {
  const [sessions, setSessions] = useState<ShiftSession[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentShift, setCurrentShift] = useState<ShiftSession | null>(null);
  const [ticker, setTicker] = useState(0);

  // Open shift modal
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState<OpenShiftPayload>({ branchId: '', openCash: 500000, notes: '' });
  const [savingOpen, setSavingOpen] = useState(false);

  // Close shift modal
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeForm, setCloseForm] = useState<CloseShiftPayload>({ closeCash: 0, notes: '' });
  const [savingClose, setSavingClose] = useState(false);

  // History expand
  const [showHistory, setShowHistory] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [all, branchList] = await Promise.all([shiftSessionService.getAll(), branchService.getAll()]);
      setSessions(all);
      setBranches(branchList);
      const open = all.find((s) => s.status === 'OPEN') ?? null;
      setCurrentShift(open);
      if (branchList.length > 0) setOpenForm((f) => ({ ...f, branchId: branchList[0].id }));
    } catch {
      toast.error('Không thể tải dữ liệu ca làm việc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Live timer for open shift
  useEffect(() => {
    if (!currentShift) return;
    const id = setInterval(() => setTicker((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [currentShift]);

  const handleOpenShift = async () => {
    if (!openForm.branchId) { toast.error('Vui lòng chọn chi nhánh'); return; }
    if (openForm.openCash < 0) { toast.error('Số tiền không hợp lệ'); return; }
    try {
      setSavingOpen(true);
      const shift = await shiftSessionService.open(openForm);
      setSessions((prev) => [shift, ...prev]);
      setCurrentShift(shift);
      setShowOpenModal(false);
      toast.success('Đã mở ca bán hàng thành công!');
    } catch (e) {
      toast.error((e as Error).message ?? 'Không thể mở ca');
    } finally {
      setSavingOpen(false);
    }
  };

  const handleCloseShift = async () => {
    if (!currentShift) return;
    if (closeForm.closeCash < 0) { toast.error('Số tiền không hợp lệ'); return; }
    try {
      setSavingClose(true);
      const updated = await shiftSessionService.close(currentShift.id, closeForm);
      setSessions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
      setCurrentShift(null);
      setShowCloseModal(false);
      toast.success('Ca bán hàng đã đóng thành công');
    } catch (e) {
      toast.error((e as Error).message ?? 'Không thể đóng ca');
    } finally {
      setSavingClose(false);
    }
  };

  const history = (sessions ?? []).filter((s) => s.status === 'CLOSED');

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-primary" />
            Ca bán hàng
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Đang tải...' : `${history.length} ca đã đóng · ${currentShift ? '1 ca đang mở' : 'Chưa có ca nào mở'}`}
          </p>
        </div>
        {!currentShift && !loading && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowOpenModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4 fill-white" /> Mở ca mới
          </motion.button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Current shift card */}
          <AnimatePresence mode="wait">
            {currentShift ? (
              <motion.div key="open-shift"
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border-2 border-green-400 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/30 dark:via-card dark:to-emerald-950/20 shadow-lg"
              >
                {/* Pulse indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                  </span>
                  <span className="text-xs font-bold text-green-600">ĐANG MỞ</span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-md">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-800 dark:text-green-300">Ca hiện tại đang chạy</h3>
                      <p className="text-sm text-green-700/70 dark:text-green-400/70">
                        {currentShift.branchName} · Mở bởi {currentShift.openedBy}
                      </p>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {[
                      { icon: Clock, label: 'Thời gian mở', value: fmtTime(currentShift.openedAt) },
                      { icon: Timer, label: 'Đã chạy', value: fmtDuration(currentShift.openedAt) },
                      { icon: Banknote, label: 'Tiền mở ca', value: fmt(currentShift.openCash) },
                      { icon: ShoppingBag, label: 'Đơn hàng', value: `${currentShift.totalOrders ?? 0} đơn` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-white/70 dark:bg-card/50 rounded-xl p-3 border border-green-200/50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                        <p className="font-bold text-sm">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setCloseForm({ closeCash: currentShift.openCash, notes: '' }); setShowCloseModal(true); }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <Square className="w-4 h-4 fill-white" /> Đóng ca
                    </motion.button>
                    <a
                      href="/admin/pos"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" /> Vào màn hình POS
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="no-shift"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-dashed border-border p-8 text-center bg-secondary/20"
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <h3 className="font-bold text-lg mb-1">Chưa có ca nào đang mở</h3>
                <p className="text-muted-foreground text-sm mb-5">Mở ca để bắt đầu nhận đơn hàng tại quầy</p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowOpenModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" /> Mở ca bán hàng
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History section */}
          {history.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-3 w-full"
              >
                <Users className="w-4 h-4" />
                Lịch sử ca ({history.length})
                {showHistory ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </button>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3">
                      {history.map((s, i) => (
                        <motion.div key={s.id} {...stagger(i)}
                          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,73,90,0.08)' }}
                          className="bg-card border border-border rounded-2xl p-4 md:p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              </div>
                              <div>
                                <div className="font-bold text-sm">{s.branchName ?? 'Chi nhánh'}</div>
                                <div className="text-xs text-muted-foreground">
                                  {fmtTime(s.openedAt)} → {s.closedAt ? fmtTime(s.closedAt) : '—'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-base text-primary">{fmt(s.totalRevenue ?? 0)}</div>
                              <div className="text-xs text-muted-foreground">{s.totalOrders ?? 0} đơn · {s.closedAt ? fmtDuration(s.openedAt, s.closedAt) : '—'}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {[
                              { label: 'Mở bởi', value: s.openedBy },
                              { label: 'Đóng bởi', value: s.closedBy ?? '—' },
                              { label: 'Tiền mở', value: fmt(s.openCash) },
                              { label: 'Tiền đóng', value: s.closeCash != null ? fmt(s.closeCash) : '—' },
                            ].map(({ label, value }) => (
                              <div key={label} className="bg-secondary/50 rounded-lg p-2">
                                <p className="text-muted-foreground mb-0.5">{label}</p>
                                <p className="font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>

                          {s.notes && (
                            <p className="mt-2.5 text-xs text-muted-foreground italic border-t border-border pt-2.5">
                              📝 {s.notes}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Open shift modal */}
      <AnimatePresence>
        {showOpenModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowOpenModal(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card rounded-2xl w-full max-w-md border border-border shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Play className="w-4 h-4 text-green-600 fill-green-600" />
                    </div>
                    <h3 className="font-bold text-lg">Mở ca bán hàng</h3>
                  </div>
                  <button onClick={() => setShowOpenModal(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Chi nhánh <span className="text-red-500">*</span></label>
                    <select
                      value={openForm.branchId}
                      onChange={(e) => setOpenForm((f) => ({ ...f, branchId: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4" /> Tiền mặt đầu ca (đồng)
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={openForm.openCash}
                      onChange={(e) => setOpenForm((f) => ({ ...f, openCash: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">= {fmt(openForm.openCash)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Ghi chú (tuỳ chọn)</label>
                    <textarea
                      value={openForm.notes}
                      onChange={(e) => setOpenForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Ghi chú cho ca này..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-border">
                  <button onClick={() => setShowOpenModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleOpenShift} disabled={savingOpen}
                    className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {savingOpen && <Loader2 className="w-4 h-4 animate-spin" />}
                    {savingOpen ? 'Đang mở...' : 'Mở ca ngay'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Close shift modal */}
      <AnimatePresence>
        {showCloseModal && currentShift && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCloseModal(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card rounded-2xl w-full max-w-md border border-border shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <Square className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                    <h3 className="font-bold text-lg">Đóng ca bán hàng</h3>
                  </div>
                  <button onClick={() => setShowCloseModal(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
                </div>

                {/* Shift summary */}
                <div className="mx-5 mt-5 rounded-xl bg-secondary/50 p-4 border border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Tổng kết ca</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { icon: Timer, label: 'Thời gian', value: fmtDuration(currentShift.openedAt) },
                      { icon: ShoppingBag, label: 'Đơn hàng', value: `${currentShift.totalOrders ?? 0}` },
                      { icon: TrendingUp, label: 'Doanh thu', value: fmt(currentShift.totalRevenue ?? 0) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label}>
                        <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-bold text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4" /> Tiền mặt cuối ca (đồng)
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={closeForm.closeCash}
                      onChange={(e) => setCloseForm((f) => ({ ...f, closeCash: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">= {fmt(closeForm.closeCash)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-1.5 block">Ghi chú</label>
                    <textarea
                      value={closeForm.notes}
                      onChange={(e) => setCloseForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Ghi chú cho ca..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-amber-700 text-xs">Sau khi đóng ca, không thể tạo thêm đơn hàng cho ca này.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-border">
                  <button onClick={() => setShowCloseModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary">Huỷ</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleCloseShift} disabled={savingClose}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {savingClose && <Loader2 className="w-4 h-4 animate-spin" />}
                    {savingClose ? 'Đang đóng...' : 'Xác nhận đóng ca'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
