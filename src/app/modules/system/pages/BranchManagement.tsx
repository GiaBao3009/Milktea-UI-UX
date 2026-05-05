import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Plus, MapPin, Phone, Users, Star, Edit2, Trash2, X, CheckCircle2, AlertTriangle, Store } from "lucide-react";
import { toast } from "sonner";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >{children}</motion.div>
  );
}
import { branches } from "@app/constants/mockData";
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

type Branch = typeof branches[0];

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: JSX.Element }> = {
  open: { label: 'Đang mở cửa', bg: '#FFEDD5', color: '#9A3412', icon: <CheckCircle2 size={13} /> },
  maintenance: { label: 'Bảo trì', bg: '#FEF3C7', color: '#92400E', icon: <AlertTriangle size={13} /> },
  closed: { label: 'Đóng cửa', bg: '#FEE2E2', color: '#991B1B', icon: <X size={13} /> },
};

interface BranchFormProps {
  branch?: Branch | null;
  onClose: () => void;
}

function BranchForm({ branch, onClose }: BranchFormProps) {
  const [mapUrl, setMapUrl] = useState('');

  let embedUrl = mapUrl;
  if (mapUrl.includes('<iframe')) {
    const match = mapUrl.match(/src="([^"]+)"/);
    if (match) {
      embedUrl = match[1];
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
            {branch ? 'Chỉnh sửa Chi nhánh' : 'Thêm Chi nhánh mới'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} style={{ color: '#A0845C' }} /></button>
        </div>
        <div className="px-5 py-5 space-y-4 overflow-y-auto flex-1">
          {[
            { label: 'Tên chi nhánh', placeholder: 'VD: SMYOU Quận 1', value: branch?.name || '' },
            { label: 'Địa chỉ', placeholder: 'Địa chỉ đầy đủ', value: branch?.address || '' },
            { label: 'Số điện thoại', placeholder: '028 xxxx xxxx', value: branch?.phone || '' },
            { label: 'Quản lý chi nhánh', placeholder: 'Tên quản lý', value: branch?.manager || '' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{f.label}</label>
              <input defaultValue={f.value} placeholder={f.placeholder}
                className="w-full px-4 rounded-xl border outline-none transition-all"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                onFocus={(e) => (e.target.style.borderColor = '#F5C088')}
                onBlur={(e) => (e.target.style.borderColor = '#F0DCC8')}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Vĩ độ (Lat)</label>
              <input placeholder="VD: 10.762622" className="w-full px-4 rounded-xl border outline-none transition-all" style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Kinh độ (Lng)</label>
              <input placeholder="VD: 106.660172" className="w-full px-4 rounded-xl border outline-none transition-all" style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Link bản đồ (Google Maps)</label>
            <input 
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              placeholder="Dán thẻ <iframe> hoặc URL nhúng vào đây..." 
              className="w-full px-4 rounded-xl border outline-none transition-all" 
              style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px' }} 
            />
          </div>
          {/* Map Preview */}
          {embedUrl ? (
            <div className="w-full h-32 mt-2 rounded-xl overflow-hidden border" style={{ borderColor: '#F0DCC8' }}>
              <iframe src={embedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          ) : (
            <div className="w-full h-24 mt-2 rounded-xl border flex items-center justify-center bg-[#FFFAF5]" style={{ borderColor: '#F0DCC8' }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }} className="flex items-center gap-1"><MapPin size={14} /> Bản đồ hiển thị vị trí chi nhánh</span>
            </div>
          )}
        </div>
        <div className="px-5 py-4 border-t flex gap-3 flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: '#F0DCC8', color: '#A0845C', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
          <button 
            onClick={() => {
              toast.success(branch ? 'Cập nhật chi nhánh thành công!' : 'Đã thêm chi nhánh mới!');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl text-sm"
            style={{ background: '#F58220', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            {branch ? 'Lưu thay đổi' : 'Thêm chi nhánh'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BranchManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(branches, 6);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {showForm && <BranchForm branch={editBranch} onClose={() => { setShowForm(false); setEditBranch(null); }} />}

      <div className="section-enter mb-6 flex flex-col gap-4 rounded-[28px] border border-[#F0DCC8] bg-[linear-gradient(135deg,#FFF8F2_0%,#FFFFFF_68%)] p-4 shadow-[0_16px_40px_rgba(93,46,15,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            Quản lý Chi nhánh
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C' }}>{branches.length} chi nhánh · {branches.filter(b => b.status === 'open').length} đang hoạt động</p>
        </div>
        <button onClick={() => { setEditBranch(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl shadow-[0_14px_28px_rgba(245,130,32,0.22)]"
          style={{ background: '#F58220', color: 'white', fontWeight: 600, fontSize: '13.5px' }}>
          <Plus size={16} /> Thêm chi nhánh
        </button>
      </div>

      {/* Summary */}
      <div className="stats-grid-compact mb-6">
        {[
          { label: 'Đang mở cửa', value: branches.filter(b => b.status === 'open').length, bg: '#FFEDD5', color: '#9A3412' },
          { label: 'Đơn hàng hôm nay', value: branches.reduce((a, b) => a + (Number(b.todayOrders) || 0), 0), bg: '#EFF6FF', color: '#1E40AF' },
          { label: 'Tổng nhân viên', value: branches.reduce((a, b) => a + (Number(b.staff) || 0), 0), bg: '#FFF3E6', color: '#F58220' },
        ].map((s, i) => (
          <div key={i} className="compact-stat-card p-3 md:p-4 flex flex-col items-center gap-2 text-center"
            style={{ boxShadow: '0 10px 24px rgba(93,46,15,0.05)' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, color: s.color, fontSize: '18px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {s.value}
            </div>
            <div style={{ fontSize: '13px', color: '#A0845C' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Branch Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={`skeleton-${i}`} className="rounded-xl border" style={{ borderColor: '#F0DCC8', background: 'white' }}>
              <div className="px-4 py-4 border-b" style={{ borderColor: '#F0DCC8' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                  <div className="flex gap-1.5"><Skeleton className="w-7 h-7 rounded-lg" /><Skeleton className="w-7 h-7 rounded-lg" /></div>
                </div>
              </div>
              <div className="px-4 py-4 space-y-2.5">
                <div className="flex items-center gap-2"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-4 w-full" /></div>
                <div className="flex items-center gap-2"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-4 w-2/3" /></div>
                <div className="flex items-center gap-2"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-4 w-5/6" /></div>
              </div>
              <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: '#FAF0E6' }}>
                <div className="text-center"><Skeleton className="h-6 w-8 mx-auto mb-1" /><Skeleton className="h-3 w-16" /></div>
                <div className="flex items-center gap-1"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-6 w-8" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedData.map((b, index) => {
              const st = statusConfig[b.status] || statusConfig.closed;
              return (
                <FadeIn key={b.id} delay={(index % 3) * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(245,130,32,0.14)' }}
                  className="rounded-xl overflow-hidden transition-shadow"
                  style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {/* Header */}
                  <div className="px-4 py-4 border-b" style={{ borderColor: '#F0DCC8', background: '#FFFAF5' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#1A1A1A' }}>{b.name}</div>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: st.bg, color: st.color }}>
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <div className="flex gap-1.5 ml-2">
                        <button onClick={() => { setEditBranch(b); setShowForm(true); }}
                          className="p-1.5 rounded-lg border hover:bg-white transition-colors"
                          style={{ borderColor: '#F0DCC8' }}>
                          <Edit2 size={13} style={{ color: '#F58220' }} />
                        </button>
                        <button className="p-1.5 rounded-lg border hover:bg-pink-50 transition-colors"
                          style={{ borderColor: '#FCBABD' }}>
                          <Trash2 size={13} style={{ color: '#8B3A4A' }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-4 py-4 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#F5C088' }} />
                      <span style={{ fontSize: '12.5px', color: '#A0845C', lineHeight: 1.4 }}>{b.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: '#F5C088' }} />
                      <span style={{ fontSize: '12.5px', color: '#A0845C' }}>{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} style={{ color: '#F5C088' }} />
                      <span style={{ fontSize: '12.5px', color: '#A0845C' }}>Quản lý: <strong style={{ color: '#1A1A1A' }}>{b.manager}</strong> · {b.staff} nhân viên</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: '#FAF0E6', background: '#FFFAF5' }}>
                    <div className="text-center">
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#F58220', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.todayOrders}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Đơn hôm nay</div>
                    </div>
                    <div className="h-8 w-px" style={{ background: '#F0DCC8' }} />
                    <div className="flex items-center gap-1">
                      <Star size={13} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.rating}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>/ 5.0</div>
                    </div>
                  </div>
                </motion.div>
                </FadeIn>
              );
            })}
          </div>

          {!isLoading && paginatedData.length === 0 && (
            <div className="mt-8">
              <EmptyState 
                icon={<Store size={28} />}
                title="Không tìm thấy chi nhánh"
                description="Không có chi nhánh nào khớp với điều kiện hiện tại."
              />
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-6">
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
        </>
      )}
    </div>
  );
}
