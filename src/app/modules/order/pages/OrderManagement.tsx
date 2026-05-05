import { useState } from "react";
import { Search, Filter, Eye, X, Clock, CheckCircle2, AlertCircle, XCircle, Package, Printer, PackageX, RotateCcw } from "lucide-react";
import { showToast } from "@app/utils/toast";
import { Logo } from "@app/components/Logo";
import { orders as initialMockOrders } from "@app/constants/mockData";
import { Skeleton } from "@app/components/ui/skeleton";
import { OrderService } from "@app/services/OrderService";
import { useEffect } from "react";
import { EmptyState } from "@app/components/ui/EmptyState";
import { usePagination } from "@app/hooks/useDataFetching";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@app/components/ui/pagination";

type Order = typeof orders[0];

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: JSX.Element }> = {
  pending: { label: 'Chờ xử lý', bg: '#FEF3C7', color: '#92400E', icon: <Clock size={12} /> },
  confirmed: { label: 'Đã xác nhận', bg: '#EFF6FF', color: '#1E40AF', icon: <CheckCircle2 size={12} /> },
  preparing: { label: 'Đang pha chế', bg: '#FFF3E6', color: '#F58220', icon: <AlertCircle size={12} /> },
  ready: { label: 'Sẵn sàng', bg: '#E8F5E9', color: '#2E7D32', icon: <Package size={12} /> },
  completed: { label: 'Hoàn thành', bg: '#FFEDD5', color: '#9A3412', icon: <CheckCircle2 size={12} /> },
  cancelled: { label: 'Đã hủy', bg: '#FEE2E2', color: '#991B1B', icon: <XCircle size={12} /> },
};

const statusTabs = ['Tất cả', 'Chờ xử lý', 'Đang pha chế', 'Sẵn sàng', 'Hoàn thành', 'Đã hủy'];
const statusMap: Record<string, string> = {
  'Chờ xử lý': 'pending', 'Đang pha chế': 'preparing', 'Sẵn sàng': 'ready',
  'Hoàn thành': 'completed', 'Đã hủy': 'cancelled'
};

const extendedStatusTabs = ['Tất cả', 'Chờ xử lý', 'Đã xác nhận', 'Đang pha chế', 'Sẵn sàng', 'Hoàn thành', 'Đã hủy'];
const extendedStatusMap: Record<string, string> = {
  'Tất cả': 'all',
  'Chờ xử lý': 'pending',
  'Đã xác nhận': 'confirmed',
  'Đang pha chế': 'preparing',
  'Sẵn sàng': 'ready',
  'Hoàn thành': 'completed',
  'Đã hủy': 'cancelled'
};

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

function OrderDetailDrawer({ order, onClose, onUpdateStatus }: { order: Order; onClose: () => void; onUpdateStatus: (id: string, status: Order['status']) => void }) {
  const st = statusConfig[order.status];
  const fakeItems = order.items.length > 0 ? order.items.map(item => ({
    name: item.productName,
    size: 'M',
    sugar: '70%',
    ice: '50%',
    topping: '',
    qty: item.quantity,
    price: item.price,
  })) : [
    { name: 'Sản phẩm mẫu', size: 'M', sugar: '70%', ice: '50%', topping: '', qty: 1, price: order.total },
  ];

  const timeline = [
    { label: 'Đặt hàng thành công', time: order.time, done: true },
    { label: 'Xác nhận đơn hàng', time: `${parseInt(order.time.split(':')[0])}:${String(parseInt(order.time.split(':')[1]) + 3).padStart(2, '0')}`, done: ['confirmed', 'preparing', 'ready', 'completed'].includes(order.status) },
    { label: 'Đang pha chế', time: '', done: ['preparing', 'ready', 'completed'].includes(order.status) },
    { label: 'Hoàn thành', time: '', done: order.status === 'completed' },
  ];

  return (
    <>
      <div className="invoice-overlay fixed inset-0 z-50 flex items-center justify-end" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <div id="print-area" className="h-full w-full max-w-md flex flex-col invoice-page"
          style={{ background: 'white', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}>
          <div className="flex flex-col items-center pt-8 pb-4 border-b" style={{ borderColor: '#F0DCC8' }}>
            <div className="p-3 rounded-2xl bg-white mb-2" style={{ border: '1px solid #FAF0E6' }}>
              <Logo size={50} />
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: '#5D2E0F' }}>CHIPS MILKTEA</h1>
            <p style={{ fontSize: '13px', color: '#A0845C', fontWeight: 500 }}>Sweet moments for you</p>
            <div className="print-title">HÓA ĐƠN THANH TOÁN</div>
          </div>
        <div className="flex items-center justify-between px-5 py-4 border-b no-print" style={{ borderColor: '#F0DCC8' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
              Chi tiết đơn hàng
            </h2>
            <p style={{ fontSize: '12px', color: '#A0845C' }}>{order.id}</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-gray-50 transition-colors" style={{ color: '#F58220' }}>
              <Printer size={16} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>In hóa đơn</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} style={{ color: '#A0845C' }} /></button>
          </div>
        </div>
        <div className="invoice-scroll flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: st.bg }}>
            <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: st.color }}>
              {st.icon} {st.label}
            </span>
            <span style={{ fontSize: '12px', color: st.color }}>{order.time} · {order.date}</span>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl p-4 space-y-2.5" style={{ border: '1px solid #F0DCC8' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#A0845C' }}>THÔNG TIN KHÁCH HÀNG</h3>
              {/* Customer type badge */}
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={order.customerType === 'member'
                  ? { background: '#FFEDD5', color: '#9A3412' }
                  : { background: '#F3F4F6', color: '#6B7280' }
                }>
                {order.customerType === 'member' ? '⭐ Thành viên' : '👤 Vãng lai'}
              </span>
            </div>
            {[
              { label: 'Tên khách', value: order.customer || 'Khách vãng lai' },
              { label: 'Điện thoại', value: order.phone || '—' },
              { label: 'Chi nhánh', value: order.branch },
              { label: 'Thanh toán', value: order.payment },
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <span style={{ fontSize: '13px', color: '#A0845C' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="rounded-xl overflow-hidden print:border-2" style={{ border: '1px solid #F0DCC8' }}>
            <div className="px-4 py-3 border-b" style={{ background: '#FFF3E6', borderColor: '#F0DCC8' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#F58220' }}>SẢN PHẨM ĐÃ ĐẶT</h3>
            </div>
            {fakeItems.map((item, i) => (
              <div key={i} className="px-4 py-3 border-b last:border-0" style={{ borderColor: '#FAF0E6' }}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{item.name}</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#F58220' }}>{formatVND(item.price)}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  Size {item.size} · Đường {item.sugar} · Đá {item.ice}{item.topping ? ` · ${item.topping}` : ''}
                </div>
              </div>
            ))}
            <div className="px-4 py-4 flex justify-between border-t-2" style={{ background: '#FFFAF5', borderColor: '#F58220' }}>
              <span className="text-base font-bold text-gray-900">TỔNG CỘNG THANH TOÁN</span>
              <span className="text-xl font-extrabold" style={{ color: '#F58220' }}>{formatVND(order.total)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl p-5 mb-8" style={{ border: '1px solid #F0DCC8' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#A0845C', marginBottom: '16px' }}>TRẠNG THÁI ĐƠN HÀNG</h3>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: step.done ? '#F5C088' : '#F3F4F6' }}>
                    {step.done && <CheckCircle2 size={12} style={{ color: '#F58220' }} />}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: '13px', fontWeight: step.done ? 600 : 400, color: step.done ? '#1A1A1A' : '#9CA3AF' }}>
                      {step.label}
                    </div>
                    {step.time && <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{step.time}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Actions */}
        {order.status === 'pending' && (
          <div className="px-5 py-4 border-t flex gap-3 no-print" style={{ borderColor: '#F0DCC8' }}>
            <button 
              onClick={() => {
                onUpdateStatus(order.id, 'cancelled');
                showToast.error(`Đã hủy đơn hàng ${order.id}`);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ borderColor: '#FCBABD', color: '#8B3A4A', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Hủy đơn
            </button>
            <button 
              onClick={() => {
                onUpdateStatus(order.id, 'confirmed');
                showToast.success(`Xác nhận đơn hàng ${order.id} thành công!`);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ background: '#F58220', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
              Xác nhận
            </button>
          </div>
        )}

        {order.status === 'confirmed' && (
          <div className="px-5 py-4 border-t flex gap-3 no-print" style={{ borderColor: '#F0DCC8' }}>
            <button
              onClick={() => {
                onUpdateStatus(order.id, 'cancelled');
                showToast.error(`Đã hủy đơn hàng ${order.id}`);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ borderColor: '#FCBABD', color: '#8B3A4A', fontFamily: "'Be Vietnam Pro', sans-serif" }}
            >
              Hủy đơn
            </button>
            <button
              onClick={() => {
                onUpdateStatus(order.id, 'preparing');
                showToast.success(`Đơn hàng ${order.id} đã chuyển sang pha chế!`);
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ background: '#2563EB', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}
            >
              Bắt đầu pha chế
            </button>
          </div>
        )}

        {order.status === 'preparing' && (
          <div className="px-5 py-4 border-t flex gap-3 no-print" style={{ borderColor: '#F0DCC8' }}>
            <button 
              onClick={() => {
                onUpdateStatus(order.id, 'ready');
                showToast.success(`Đơn hàng ${order.id} đã pha chế xong!`);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-sm"
              style={{ background: '#2563EB', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
              Sẵn sàng giao
            </button>
          </div>
        )}

        {order.status === 'ready' && (
          <div className="px-5 py-4 border-t flex gap-3 no-print" style={{ borderColor: '#F0DCC8' }}>
            <button 
              onClick={() => {
                onUpdateStatus(order.id, 'completed');
                showToast.success(`Đơn hàng ${order.id} đã hoàn thành!`);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-sm"
              style={{ background: '#059669', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
              Hoàn thành đơn
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(OrderService.getAllOrders());
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);

  // Listen for real-time updates from User app
  useEffect(() => {
    const handleRefresh = () => {
      setOrders(OrderService.getAllOrders());
    };
    window.addEventListener('storage', handleRefresh);
    const interval = setInterval(handleRefresh, 3000); // Poll every 3s as fallback
    return () => {
      window.removeEventListener('storage', handleRefresh);
      clearInterval(interval);
    };
  }, []);

  // Derived data (uses state values above)
  const filtered = orders.filter(o => {
    const matchStatus = activeTab === 'Tất cả' || o.status === extendedStatusMap[activeTab];
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(filtered, 5);

  const countByStatus = (s: string) => s === 'Tất cả' ? orders.length : orders.filter(o => o.status === extendedStatusMap[s]).length;

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    const result = OrderService.updateOrderStatus(id, status);
    if (!result.success) {
      showToast.error(result.error || 'Không thể cập nhật trạng thái đơn hàng.');
      return;
    }
    setOrders(OrderService.getAllOrders());
    setSelectedOrder(result.order || null);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(paginatedData.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleBulkPrint = () => {
    if (selectedOrderIds.length === 0) return;
    setIsBulkPrinting(true);
    showToast.loading('Đang chuẩn bị in hàng loạt...');
    setTimeout(() => {
      showToast.dismiss();
      window.print();
      setIsBulkPrinting(false);
      showToast.success('Đã gửi lệnh in thành công!');
    }, 1000);
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <style>{`
        @media print {
          @page { margin: 10mm 0; }
          body { margin: 0; padding: 0; background: white; }
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }

          .invoice-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            display: block !important;
            z-index: 9999 !important;
          }
          #print-area {
            position: relative !important;
            width: 100% !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            display: block !important;
            background: white !important;
          }
          #print-area .invoice-scroll {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            flex: none !important;
            padding: 20px 40px !important;
            margin: 0 !important;
          }
          .invoice-page {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            page-break-after: auto;
            background: white !important;
          }
          .no-print { display: none !important; }
          
          /* Highlight for invoice text */
          .print-title {
            display: block !important;
            text-align: center;
            font-size: 24px;
            font-weight: 800;
            color: #F58220;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #F58220;
            padding-bottom: 10px;
          }
        }
        .print-title { display: none; }
      `}</style>
      {selectedOrder && (
        <OrderDetailDrawer 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      
      {/* Bulk Print Area (Hidden unless printing) */}
      {isBulkPrinting && (
        <div id="print-area" className="hidden print:block">
          {orders.filter(o => selectedOrderIds.includes(o.id)).map(order => (
            <div key={order.id} className="invoice-page bg-white p-8 max-w-md mx-auto border border-gray-200 my-4">
               <div className="flex flex-col items-center py-6 border-b" style={{ borderColor: '#F0DCC8' }}>
                  <Logo size={40} />
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, color: '#5D2E0F' }}>CHIPS MILKTEA</h1>
                  <p style={{ fontSize: '12px', color: '#A0845C', fontWeight: 500 }}>Sweet moments for you</p>
                </div>
                <div className="py-4 border-b" style={{ borderColor: '#F0DCC8' }}>
                  <h2 className="text-center font-bold text-lg">HÓA ĐƠN BÁN HÀNG</h2>
                  <p className="text-center text-sm text-gray-500">{order.id}</p>
                </div>
                <div className="py-4 space-y-2">
                  <div className="flex justify-between text-sm"><span>Khách hàng:</span><span className="font-bold">{order.customer}</span></div>
                  <div className="flex justify-between text-sm"><span>Điện thoại:</span><span>{order.phone}</span></div>
                  <div className="flex justify-between text-sm"><span>Thời gian:</span><span>{order.time} · {order.date}</span></div>
                  <div className="flex justify-between text-sm"><span>Chi nhánh:</span><span>{order.branch}</span></div>
                  <div className="flex justify-between text-sm"><span>Thanh toán:</span><span>{order.payment}</span></div>
                </div>
                <div className="py-4 border-t border-b border-gray-100">
                   <table className="w-full text-sm">
                     <thead>
                       <tr className="text-left border-b border-gray-100">
                         <th className="pb-2">Sản phẩm</th>
                         <th className="pb-2 text-right">Giá</th>
                       </tr>
                     </thead>
                     <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-2">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-xs text-gray-400">x{item.quantity}</div>
                            </td>
                            <td className="py-2 text-right font-bold">{formatVND(item.price)}</td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
                <div className="py-4 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{formatVND(order.total)}</span>
                </div>
                <div className="pt-8 text-center text-xs text-gray-400">
                   Cảm ơn quý khách đã ủng hộ CHIPS MILKTEA!<br/>
                   Hẹn gặp lại quý khách lần sau.
                </div>
            </div>
          ))}
        </div>
      )}

        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
              Quản lý Đơn hàng
            </h1>
            <p style={{ fontSize: '13.5px', color: '#A0845C' }}>{orders.length} đơn hàng hôm nay · {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <button 
            onClick={() => {
              setOrders(OrderService.getAllOrders());
              showToast.success('Dữ liệu đã được đồng bộ!');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:bg-gray-50"
            style={{ borderColor: '#F0DCC8', color: '#F58220', background: 'white' }}
          >
            <RotateCcw size={16} />
            Làm mới
          </button>
        </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {extendedStatusTabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab ? '#F58220' : 'white',
              color: activeTab === tab ? 'white' : '#A0845C',
              border: `1px solid ${activeTab === tab ? '#F58220' : '#F0DCC8'}`,
              fontWeight: activeTab === tab ? 600 : 400
            }}>
            {tab}
            <span className="px-1.5 py-0.5 rounded-full text-xs"
              style={{ background: activeTab === tab ? 'rgba(255,255,255,0.2)' : '#FFF3E6', color: activeTab === tab ? 'white' : '#F58220' }}>
              {countByStatus(tab)}
            </span>
          </button>
        ))}
      </div>

        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên khách..."
            className="w-full pl-9 pr-4 rounded-xl border outline-none shadow-sm"
            style={{ height: '40px', borderColor: '#F0DCC8', fontSize: '13px', background: 'white' }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedOrderIds.length > 0 && (
            <button onClick={handleBulkPrint} className="flex flex-1 items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm sm:flex-none"
              style={{ background: '#F58220', color: 'white' }}>
              <Printer size={14} /> <span className="whitespace-nowrap">In ({selectedOrderIds.length})</span>
            </button>
          )}
          <button className="flex flex-1 items-center justify-center gap-1.5 px-4 py-2 rounded-xl border text-sm transition-all hover:bg-gray-50 sm:flex-none"
            style={{ borderColor: '#F0DCC8', color: '#A0845C', background: 'white' }}>
            <Filter size={14} /> <span className="whitespace-nowrap">Lọc</span>
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden rounded-xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b space-y-2" style={{ borderColor: '#FAF0E6' }}>
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-20 rounded-full" /></div>
              <Skeleton className="h-4 w-40" />
              <div className="flex justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-20" /></div>
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="py-10"><EmptyState icon={<PackageX size={28} />} title="Không tìm thấy đơn hàng" description="Không có đơn hàng nào khớp." /></div>
        ) : (
          paginatedData.map((order) => {
            const st = statusConfig[order.status];
            return (
              <div key={order.id} className="p-4 border-b" style={{ borderColor: '#FAF0E6' }}
                onClick={() => setSelectedOrder(order)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F58220] focus:ring-[#F58220]"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={(e) => { e.stopPropagation(); handleSelectOrder(order.id); }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#F58220' }}>{order.id}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: st.bg, color: st.color, fontSize: '11px', fontWeight: 600 }}>
                    {st.icon} {st.label}
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{order.customer}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap" style={{ fontSize: '12px', color: '#A0845C' }}>
                  <span>{order.branch}</span>
                  <span>·</span>
                  <span>{order.time}</span>
                  <span>·</span>
                  <span>{Array.isArray(order.items) ? order.items.length : order.items} món</span>
                  <span>·</span>
                  <span>{order.payment}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F58220' }}>{formatVND(order.total)}</span>
                  <Eye size={16} style={{ color: '#9CA3AF' }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl overflow-hidden"
        style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF3E6' }}>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F58220] focus:ring-[#F58220]"
                    onChange={handleSelectAll}
                    checked={selectedOrderIds.length === paginatedData.length && paginatedData.length > 0}
                  />
                </th>
                {['Mã đơn', 'Khách hàng', 'Loại', 'Chi nhánh', 'Thời gian', 'Món', 'Tổng tiền', 'Thanh toán', 'Trạng thái', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: '12px', fontWeight: 600, color: '#F58220', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b" style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-4 rounded" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-24" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-5 w-12 rounded-full" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-8" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="px-4 py-3.5"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                  </tr>
                ))
              ) : (
                paginatedData.map((order, i) => {
                  const st = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                      <td className="px-4 py-3.5">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F58220] focus:ring-[#F58220]"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '13px', fontWeight: 600, color: '#F58220' }}>{order.id}</span></td>
                      <td className="px-4 py-3.5">
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A' }}>{order.customer || 'Khách vãng lai'}</div>
                        <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{order.phone || '—'}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={order.customerType === 'member'
                            ? { background: '#FFEDD5', color: '#9A3412' }
                            : { background: '#F3F4F6', color: '#6B7280' }
                          }>
                          {order.customerType === 'member' ? '⭐ TV' : '👤 VL'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '13px', color: '#A0845C' }}>{order.branch}</span></td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '13px', color: '#A0845C' }}>{order.time}</span></td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '13px', color: '#A0845C' }}>{Array.isArray(order.items) ? order.items.length : order.items}</span></td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{formatVND(order.total)}</span></td>
                      <td className="px-4 py-3.5"><span style={{ fontSize: '12px', color: '#A0845C' }}>{order.payment}</span></td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
                          style={{ background: st.bg, color: st.color, fontSize: '11.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {st.icon} {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <Eye size={15} style={{ color: '#F58220' }} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {!isLoading && paginatedData.length === 0 && (
            <div className="py-10"><EmptyState icon={<PackageX size={28} />} title="Không tìm thấy đơn hàng" description="Không có đơn hàng nào khớp với điều kiện lọc." /></div>
          )}
        </div>
      </div>

      {/* Pagination (shared) */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

