import { useState, useEffect } from "react";
import { Search, Eye, X, Award, ShoppingBag, TrendingUp, Users, Lock, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { customers } from "@app/constants/mockData";
import { Skeleton } from "@app/components/ui/skeleton";
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

type Customer = typeof customers[0];

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

const tierConfig: Record<string, { bg: string; color: string }> = {
  Gold: { bg: '#FEF9C3', color: '#854D0E' },
  Silver: { bg: '#F3F4F6', color: '#374151' },
  Member: { bg: '#FFF3E6', color: '#F58220' },
  Blacklist: { bg: '#FEE2E2', color: '#991B1B' },
};

interface CustomerDetailProps {
  customer: Customer;
  onClose: () => void;
}

function CustomerDetail({ customer, onClose }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const tier = tierConfig[customer.tier] || tierConfig.Member;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div className="h-full w-full max-w-md flex flex-col" style={{ background: 'white', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
            Hồ sơ khách hàng
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} style={{ color: '#A0845C' }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Avatar section */}
          <div className="px-5 py-6 text-center border-b" style={{ borderColor: '#F0DCC8', background: '#FFFAF5' }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3"
              style={{ background: '#F5C088', fontSize: '24px', fontWeight: 700, color: '#5D2E0F' }}>
              {customer.name[0]}
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{customer.name}</div>
            <div style={{ fontSize: '13px', color: '#A0845C', marginTop: '2px' }}>{customer.phone}</div>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: tier.bg, color: tier.color }}>
              {customer.tier === 'Blacklist' ? '🚫 Blacklist' : `⭐ ${customer.tier} Member`}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-0 border-b" style={{ borderColor: '#F0DCC8' }}>
            {[
              { label: 'Điểm tích lũy', value: customer.points.toLocaleString(), icon: <Award size={16} style={{ color: '#F58220' }} /> },
              { label: 'Đơn hàng', value: customer.totalOrders, icon: <ShoppingBag size={16} style={{ color: '#F58220' }} /> },
              { label: 'Tổng chi tiêu', value: formatVND(customer.totalSpent), icon: <TrendingUp size={16} style={{ color: '#F58220' }} /> },
            ].map((stat, i) => (
              <div key={i} className={`py-4 text-center ${i < 2 ? 'border-r' : ''}`} style={{ borderColor: '#F0DCC8' }}>
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex px-5 border-b mt-2" style={{ borderColor: '#F0DCC8' }}>
            <button onClick={() => setActiveTab('info')} className={`py-3 mr-6 font-semibold text-[13px] relative ${activeTab === 'info' ? 'text-[#F58220]' : 'text-[#A0845C]'}`}>
              Thông tin chung
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F58220]" />}
            </button>
            <button onClick={() => setActiveTab('history')} className={`py-3 font-semibold text-[13px] relative ${activeTab === 'history' ? 'text-[#F58220]' : 'text-[#A0845C]'}`}>
              Lịch sử đơn hàng
              {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F58220]" />}
            </button>
          </div>

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="px-5 py-4 space-y-6">
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#A0845C', letterSpacing: '0.05em', marginBottom: '12px' }}>THÔNG TIN TÀI KHOẢN</h3>
                {[
                  { label: 'Email', value: customer.email },
                  { label: 'Ngày tham gia', value: customer.joinDate },
                  { label: 'Đơn hàng gần nhất', value: customer.lastOrder },
                  { label: 'Hạng thành viên', value: customer.tier },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b" style={{ borderColor: '#FAF0E6' }}>
                    <span style={{ fontSize: '13px', color: '#A0845C' }}>{item.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#A0845C', letterSpacing: '0.05em', marginBottom: '12px' }}>THAO TÁC</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      toast.success(`Đã cập nhật điểm cho khách hàng ${customer.name}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all hover:bg-gray-50"
                    style={{ borderColor: '#F0DCC8', color: '#1A1A1A', fontSize: '13.5px', fontWeight: 600 }}>
                    <Edit3 size={16} style={{ color: '#F58220' }} /> Điều chỉnh điểm thủ công
                  </button>
                  <button 
                    onClick={() => {
                      toast.error(`Đã khóa tài khoản ${customer.name}`);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all hover:bg-pink-50"
                    style={{ borderColor: '#FCBABD', color: '#8B3A4A', fontSize: '13.5px', fontWeight: 600 }}>
                    <Lock size={16} /> Khóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="px-5 py-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: '#F0DCC8', background: '#FFFAF5' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>#ORD-2412{i}00</span>
                    <span style={{ fontSize: '12px', color: '#A0845C' }}>20/04/2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '13px', color: '#A0845C' }}>2 sản phẩm</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#F58220' }}>125.000đ</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerManagement() {
  const [search, setSearch] = useState('');
  const [activeTier, setActiveTier] = useState('Tất cả');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(customers);

  useEffect(() => {
    const handleRefresh = () => {
      const stored = JSON.parse(localStorage.getItem('milktea_all_users') || '[]');
      // Map stored users to Customer format
      const mappedStored = stored.map((u: any) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        email: u.email,
        tier: u.tier || 'Member',
        points: u.loyaltyPoints || 0,
        totalOrders: 0,
        totalSpent: 0,
        joinDate: new Date().toLocaleDateString('vi-VN'),
        lastOrder: 'Chưa có',
      }));
      // Merge preventing duplicates by email
      const merged = [...mappedStored, ...customers].filter((c, i, self) => 
        i === self.findIndex((t) => t.email === c.email)
      );
      setAllCustomers(merged);
    };

    handleRefresh();
    window.addEventListener('storage', handleRefresh);
    return () => window.removeEventListener('storage', handleRefresh);
  }, []);

  const tiers = ['Tất cả', 'Gold', 'Silver', 'Member', 'Blacklist'];
  const filtered = allCustomers.filter(c =>
    (activeTier === 'Tất cả' || c.tier === activeTier) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(filtered, 5);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {selectedCustomer && <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}

      <div className="mb-6">
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
          Quản lý Khách hàng
        </h1>
        <p style={{ fontSize: '13.5px', color: '#A0845C' }}>{allCustomers.length} khách hàng đã đăng ký</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
        {[
          { label: 'Gold Member', count: allCustomers.filter(c => c.tier === 'Gold').length, bg: '#FEF9C3', color: '#854D0E' },
          { label: 'Silver Member', count: allCustomers.filter(c => c.tier === 'Silver').length, bg: '#F3F4F6', color: '#374151' },
          { label: 'Member', count: allCustomers.filter(c => c.tier === 'Member' || c.tier === 'Bronze').length, bg: '#FFF3E6', color: '#F58220' },
          { label: 'Blacklist', count: allCustomers.filter(c => c.tier === 'Blacklist').length, bg: '#FEE2E2', color: '#991B1B' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-3 md:p-4 flex flex-col xl:flex-row items-center xl:items-start gap-2 md:gap-3 text-center xl:text-left"
            style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: card.bg, color: card.color, fontWeight: 700, fontSize: '18px' }}>
              {card.count}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: '#A0845C' }}>thành viên</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại..."
            className="w-full pl-9 pr-4 rounded-xl border outline-none"
            style={{ height: '40px', borderColor: '#F0DCC8', fontSize: '13px', background: 'white' }}
          />
        </div>
        <div className="flex gap-1.5">
          {tiers.map(t => (
            <button key={t} onClick={() => setActiveTier(t)}
              className="px-3.5 py-2 rounded-xl text-sm transition-all"
              style={{
                background: activeTier === t ? '#F58220' : 'white',
                color: activeTier === t ? 'white' : '#A0845C',
                border: `1px solid ${activeTier === t ? '#F58220' : '#F0DCC8'}`,
                fontWeight: activeTier === t ? 600 : 400
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden rounded-xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="px-4 py-3 border-b" style={{ background: '#FFF3E6', borderColor: '#F0DCC8' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F58220' }}>{filtered.length} khách hàng</span>
        </div>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#FAF0E6' }}>
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1"><Skeleton className="h-4 w-32 mb-1.5" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="py-10"><EmptyState icon={<Users size={28} />} title="Không tìm thấy khách hàng" description="Không có khách hàng nào khớp." /></div>
        ) : (
          paginatedData.map((c) => {
            const tier = tierConfig[c.tier] || tierConfig.Member;
            return (
              <div key={c.id} className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#FAF0E6' }}
                onClick={() => setSelectedCustomer(c)}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5C088', color: '#5D2E0F', fontWeight: 700, fontSize: '14px' }}>{c.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{c.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: tier.bg, color: tier.color }}>{c.tier}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#A0845C' }}>{c.phone}</div>
                  <div className="flex items-center gap-3 mt-1" style={{ fontSize: '11.5px', color: '#9CA3AF' }}>
                    <span>&#11088; {c.points.toLocaleString()} điểm</span>
                    <span>·</span>
                    <span>{c.totalOrders} đơn</span>
                    <span>·</span>
                    <span>{formatVND(c.totalSpent)}</span>
                  </div>
                </div>
                <Eye size={16} style={{ color: '#F58220', flexShrink: 0 }} />
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#FFF3E6' }}>
              {['Khách hàng', 'Liên hệ', 'Hạng', 'Điểm', 'Đơn hàng', 'Chi tiêu', 'Tham gia', ''].map(h => (
                <th key={h} className="text-left px-5 py-3" style={{ fontSize: '12px', fontWeight: 600, color: '#F58220', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b" style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-4 w-24" /></div></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-32" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-8" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-7 w-7 rounded-lg" /></td>
                </tr>
              ))
            ) : (
              paginatedData.map((c, i) => {
                const tier = tierConfig[c.tier] || tierConfig.Member;
                return (
                  <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5C088', color: '#5D2E0F', fontWeight: 700, fontSize: '13px' }}>{c.name[0]}</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{c.name}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div style={{ fontSize: '13px', color: '#1A1A1A' }}>{c.phone}</div>
                      <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{c.email}</div>
                    </td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: tier.bg, color: tier.color }}>{c.tier}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '13px', fontWeight: 600, color: '#F58220' }}>{c.points.toLocaleString()}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '13px', color: '#1A1A1A' }}>{c.totalOrders}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{formatVND(c.totalSpent)}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '12px', color: '#A0845C' }}>{c.joinDate}</span></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelectedCustomer(c)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye size={15} style={{ color: '#F58220' }} /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {!isLoading && paginatedData.length === 0 && (
          <div className="py-10"><EmptyState icon={<Users size={28} />} title="Không tìm thấy khách hàng" description="Không có khách hàng nào khớp với điều kiện lọc." /></div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="px-5 py-4 border-t" style={{ borderColor: '#F0DCC8' }}>
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
    </div>
  );
}
