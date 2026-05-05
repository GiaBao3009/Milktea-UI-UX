import { useState, useEffect, useMemo } from "react";
import { Search, Eye, Filter, UserPlus, ShoppingBag, TrendingUp, Users, Crown, X, Package } from "lucide-react";
import { EmptyState } from "@app/components/ui/EmptyState";
import { usePagination } from "@app/hooks/useDataFetching";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@app/components/ui/pagination";
import { OrderService } from "@app/services/OrderService";

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

export function CustomerCRM() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState("Tất cả");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Load data
  useEffect(() => {
    const handleRefresh = () => {
      const storedUsers = JSON.parse(localStorage.getItem('milktea_users_clean') || '[]');
      // Map stored users to standard format
      const mappedStored = storedUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        tier: u.tier || 'Member',
        points: u.loyaltyPoints || 0,
        createdAt: u.createdAt || new Date().toISOString()
      }));
      setCustomers(mappedStored);
      setOrders(OrderService.getAllOrders());
    };
    handleRefresh();
    window.addEventListener('storage', handleRefresh);
    return () => window.removeEventListener('storage', handleRefresh);
  }, []);

  // Compute CRM metrics
  const crmData = useMemo(() => {
    // Map each customer with their real orders
    const enriched = customers.map(c => {
      const customerOrders = orders.filter(o => o.customerId === c.id);
      const totalSpent = customerOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
      return {
        ...c,
        tier: c.tier || (totalSpent > 1000000 ? 'Gold' : totalSpent > 500000 ? 'Silver' : 'Member'),
        totalOrders: customerOrders.length,
        totalSpent,
        lastOrder: customerOrders.length > 0 ? customerOrders[0].date : 'Chưa có',
        orderHistory: customerOrders
      };
    });

    const filtered = enriched.filter(c =>
      (activeTier === 'Tất cả' || c.tier === activeTier) &&
      (c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.includes(search))
    );

    return { enriched, filtered };
  }, [customers, orders, search, activeTier]);

  const { currentPage, setCurrentPage, totalPages, paginatedData } = usePagination(crmData.filtered, 8);

  const stats = [
    { label: "Tổng Khách Hàng", value: customers.length, bg: "#EFF6FF", color: "#1E40AF", icon: Users },
    { label: "Thành viên Gold", value: crmData.enriched.filter(c => c.tier === 'Gold').length, bg: "#FEF3C7", color: "#92400E", icon: Crown },
    { label: "Đơn mua từ Member", value: orders.filter(o => o.customerType === 'member').length, bg: "#E8F5E9", color: "#2E7D32", icon: ShoppingBag },
    { label: "Doanh thu Member", value: formatVND(crmData.enriched.reduce((sum, c) => sum + c.totalSpent, 0)), bg: "#F3E8FF", color: "#6B21A8", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            CRM & Phân Tích Khách Hàng
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C' }}>Quản lý account, phân tích đơn mua và tổng quan thành viên</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-[#F0DCC8] flex items-center gap-4 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div>
              <div className="text-[12px] font-bold text-[#A0845C]">{stat.label}</div>
              <div className="text-xl font-black text-[#1A1A1A] font-heading mt-0.5">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="rounded-[24px] bg-white border border-[#F0DCC8] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F0DCC8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAFAFA]">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên, SĐT, Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {['Tất cả', 'Gold', 'Silver', 'Member'].map(tier => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors ${activeTier === tier ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FFF8F1]">
                {['Khách hàng', 'Liên hệ', 'Hạng', 'Tổng đơn', 'Đã chi tiêu', 'Ngày tạo', 'Thao tác'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-[#F58220]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF0E6]">
              {paginatedData.map((c) => (
                <tr key={c.id} className="hover:bg-[#FFFCF8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1A1A] text-[13px]">{c.name}</div>
                        <div className="text-[11px] text-[#A0845C]">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[12.5px] font-medium text-gray-700">{c.phone || 'Chưa cập nhật'}</div>
                    <div className="text-[11.5px] text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${c.tier === 'Gold' ? 'bg-[#FEF3C7] text-[#92400E]' : c.tier === 'Silver' ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-600'}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#1A1A1A]">{c.totalOrders} đơn</td>
                  <td className="px-5 py-4 font-bold text-[#F58220]">{formatVND(c.totalSpent)}</td>
                  <td className="px-5 py-4 text-[12.5px] text-gray-600">{new Date(c.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedCustomer(c)} className="p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100 transition-colors tooltip-trigger" title="Xem lịch sử mua">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedData.length === 0 && (
             <div className="py-12">
               <EmptyState icon={<UserPlus size={28} />} title="Không có tài khoản" description="Chưa có khách hàng nào trong hệ thống hoặc không khớp tìm kiếm." />
             </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F0DCC8] bg-gray-50">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] anim-fade-up">
            <div className="p-5 border-b border-[#F0DCC8] flex items-center justify-between bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#F58220] font-black text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A1A] leading-tight">Lịch sử đơn mua</h3>
                  <p className="text-[12.5px] text-[#A0845C]">{selectedCustomer.name} · {selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
              {selectedCustomer.orderHistory.length === 0 ? (
                <EmptyState icon={<Package size={24} />} title="Chưa có đơn hàng" description="Khách hàng này chưa thực hiện giao dịch nào." />
              ) : (
                selectedCustomer.orderHistory.map((order: any) => (
                  <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[13px] text-[#1A1A1A]">#{order.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500">{order.date} · {order.time} · {order.branch}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#F58220]">{formatVND(order.total)}</div>
                      <div className="text-[11px] text-gray-400">{order.items?.length || 0} món</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
