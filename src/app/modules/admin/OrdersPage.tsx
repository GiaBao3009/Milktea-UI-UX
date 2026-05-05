import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, X, Eye, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTrans } from '@app/hooks/useTranslation';
import { orderApiService, type AdminOrder, type OrderStatus } from '@app/modules/order/services/orderApiService';

const statusFilters = [
  { value: 'ALL', labelKey: 'admin.orders.status.all' },
  { value: 'PENDING', labelKey: 'admin.orders.status.pending' },
  { value: 'PAID', labelKey: 'admin.orders.status.paid' },
  { value: 'COMPLETED', labelKey: 'admin.orders.status.completed' },
  { value: 'CANCELED', labelKey: 'admin.orders.status.canceled' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAID: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELED: 'bg-red-100 text-red-700 border-red-200',
};
const statusLabels: Record<string, string> = {
  PENDING: 'admin.orders.status.pending', PAID: 'admin.orders.status.paid', COMPLETED: 'admin.orders.status.completed', CANCELED: 'admin.orders.status.canceled',
};
const paymentLabels: Record<string, string> = {
  CASH: 'admin.orders.payment_method.cash', VNPAY: 'admin.orders.payment_method.vnpay', BANK_TRANSFER: 'admin.orders.payment_method.bank_transfer',
};

export default function OrdersPage() {
  const { t } = useTrans();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderApiService.getAll({ status: statusFilter, search: searchQuery });
      setOrders(data);
    } catch {
      toast.error(t('admin.orders.load_error'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => { load(); }, [load]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await orderApiService.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((o) => o ? { ...o, status: newStatus } : o);
      toast.success(`${t('admin.orders.update_status_success')} ${t(statusLabels[newStatus])}`);
      setSelectedOrder(null);
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.orders.update_status_error'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVNPay = async (orderId: string) => {
    try {
      toast.info(t('admin.orders.creating_vnpay_link'));
      const url = await orderApiService.createVNPayUrl(orderId);
      window.open(url, '_blank');
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.orders.vnpay_error'));
    }
  };

  const handleCash = async (orderId: string) => {
    try {
      await orderApiService.payCash(orderId);
      await handleUpdateStatus(orderId, 'PAID');
    } catch (e) {
      toast.error((e as Error).message ?? t('admin.orders.cash_error'));
    }
  };

  const counts = statusFilters.map((f) =>
    f.value === 'ALL' ? orders.length : orders.filter((o) => o.status === f.value).length
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.orders.title')}</h2>
          <p className="text-muted-foreground">{loading ? t('admin.orders.loading') : `${orders.length} ${t('admin.orders.orders_count_placeholder')}`}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={load}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <RefreshCw className="w-4 h-4" /><span>{t('admin.orders.refresh')}</span>
        </motion.button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((f, i) => (
          <motion.button key={f.value} whileTap={{ scale: 0.95 }} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-lg border whitespace-nowrap transition-all text-sm font-medium ${
              statusFilter === f.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-secondary'
            }`}>
            {t(f.labelKey)} <span className="ml-1 font-bold">{counts[i]}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.orders.search_placeholder')}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
        </div>
        <button className="px-4 py-3 bg-card border border-border rounded-lg flex items-center gap-2 hover:bg-secondary transition-colors text-sm">
          <Filter className="w-4 h-4" /><span>{t('admin.orders.advanced_filter')}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    {[t('admin.orders.columns.order_id'), t('admin.orders.columns.customer'), t('admin.orders.columns.branch'), t('admin.orders.columns.items_count'), t('admin.orders.columns.total_amount'), t('admin.orders.columns.payment'), t('admin.orders.columns.status'), t('admin.orders.columns.action')].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-primary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4"><span className="font-semibold text-primary">{order.id}</span></td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.customer?.name || t('admin.orders.retail_customer')}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.branch}</td>
                      <td className="px-6 py-4 text-sm">{order.items.length}</td>
                      <td className="px-6 py-4 font-semibold text-sm">{order.total.toLocaleString('vi-VN')}đ</td>
                      <td className="px-6 py-4 text-sm">{t(paymentLabels[order.paymentMethod])}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                          {t(statusLabels[order.status])}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-primary" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-16 text-center text-muted-foreground text-sm">{t('admin.orders.no_orders')}</div>
              )}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <motion.div key={order.id} whileHover={{ y: -2 }} onClick={() => setSelectedOrder(order)}
                className="bg-card rounded-xl p-4 border border-border space-y-3 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-primary">{order.id}</p>
                    <p className="text-sm font-medium">{order.customer?.name || t('admin.orders.retail_customer')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                    {t(statusLabels[order.status])}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">{order.items.length} {t('admin.orders.items')} • {t(paymentLabels[order.paymentMethod])}</span>
                  <span className="font-semibold text-primary">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-card z-50 overflow-y-auto shadow-2xl">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{t('admin.orders.order_detail')}</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-secondary rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 space-y-2 text-sm">
                  {[
                    [t('admin.orders.columns.order_id'), <span className="font-semibold text-primary">{selectedOrder.id}</span>],
                    [t('admin.orders.columns.customer'), selectedOrder.customer?.name || t('admin.orders.retail_customer')],
                    [t('admin.orders.phone'), selectedOrder.customer.phone],
                    [t('admin.orders.columns.branch'), selectedOrder.branch],
                    [t('admin.orders.time'), selectedOrder.createdAt],
                    [t('admin.orders.columns.status'), <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[selectedOrder.status]}`}>{t(statusLabels[selectedOrder.status])}</span>],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">{t('admin.orders.products')}</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.product}</p>
                          <p className="text-xs text-muted-foreground">{t('admin.orders.size')} {item.size} × {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-primary text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('admin.orders.total')}</span>
                    <span className="text-primary">{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t('admin.orders.columns.payment')}: {t(paymentLabels[selectedOrder.paymentMethod])}</p>
                </div>

                {selectedOrder.logs && selectedOrder.logs.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">{t('admin.orders.history')}</h4>
                    <div className="space-y-3">
                      {selectedOrder.logs.map((log, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-muted-foreground">{log.time} • {log.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  {selectedOrder.status === 'PENDING' && selectedOrder.paymentMethod === 'VNPAY' && (
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleVNPay(selectedOrder.id)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                      <CreditCard className="w-5 h-5" />{t('admin.orders.create_vnpay_link')}
                    </motion.button>
                  )}
                  {selectedOrder.status === 'PENDING' && (
                    <motion.button whileTap={{ scale: 0.97 }}
                      disabled={updatingId === selectedOrder.id}
                      onClick={() => selectedOrder.paymentMethod === 'CASH'
                        ? handleCash(selectedOrder.id)
                        : handleUpdateStatus(selectedOrder.id, 'PAID')}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60">
                      {updatingId === selectedOrder.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                      {t('admin.orders.confirm_payment')}
                    </motion.button>
                  )}
                  {selectedOrder.status === 'PAID' && (
                    <motion.button whileTap={{ scale: 0.97 }}
                      disabled={updatingId === selectedOrder.id}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                      {updatingId === selectedOrder.id ? t('admin.orders.completing') : t('admin.orders.complete_order')}
                    </motion.button>
                  )}
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PAID') && (
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELED')}
                      className="w-full py-2.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm">
                      {t('admin.orders.cancel_order')}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
