import { useState } from "react";
import { Plus, Tag, Copy, X, CheckCircle2, Clock, AlertCircle, Loader2, Ticket, Upload } from "lucide-react";
import { showToast } from "@app/utils/toast";
import { vouchers } from "@app/constants/mockData";
import { Skeleton } from "@app/components/ui/skeleton";
import { EmptyState } from "@app/components/ui/EmptyState";
import { useInfiniteScroll } from "@app/hooks/useDataFetching";

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ';

interface VoucherFormProps {
  onClose: () => void;
}

function VoucherForm({ onClose }: VoucherFormProps) {
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [isBatch, setIsBatch] = useState(false);
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
            Tạo Voucher mới
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} style={{ color: '#A0845C' }} /></button>
        </div>
        <div className="px-5 py-5 space-y-4 overflow-y-auto flex-1">
          {/* Batch toggle */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isBatch} onChange={() => setIsBatch(false)} className="accent-[#F58220]" />
                <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500 }}>Tạo 1 mã cụ thể</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isBatch} onChange={() => setIsBatch(true)} className="accent-[#F58220]" />
                <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500 }}>Tạo hàng loạt (Batch)</span>
              </label>
            </div>
            <p style={{ fontSize: '11.5px', color: '#A0845C', lineHeight: 1.4, marginBottom: '8px' }}>
              {isBatch 
                ? "Tạo nhiều mã ngẫu nhiên có cùng Tiền tố (VD: SUM-A1B2, SUM-X9Y8). Thích hợp để in thẻ cào, phát cho từng khách hàng cụ thể để họ chỉ dùng 1 lần." 
                : "Tạo 1 mã duy nhất (VD: SUMMER2026). Thích hợp cho các chiến dịch public, ai cũng có thể nhập mã này để dùng."}
            </p>
          </div>

          {/* Code */}
          {!isBatch ? (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Mã voucher *
              </label>
              <input placeholder="VD: SUMMER2026" className="w-full px-4 rounded-xl border outline-none transition-all uppercase"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: '0.05em' }}
                onFocus={(e) => { e.target.style.borderColor = '#F5C088'; }}
                onBlur={(e) => { e.target.style.borderColor = '#F0DCC8'; }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tiền tố mã (Prefix)</label>
                <input placeholder="VD: SUM" className="w-full px-4 rounded-xl border outline-none uppercase" style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Số lượng mã</label>
                <input placeholder="100" type="number" className="w-full px-4 rounded-xl border outline-none" style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px' }} />
              </div>
            </div>
          )}
          {/* Name */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Tên chương trình *
            </label>
            <input placeholder="VD: Khuyến mãi mùa hè" className="w-full px-4 rounded-xl border outline-none transition-all"
              style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              onFocus={(e) => { e.target.style.borderColor = '#F5C088'; }}
              onBlur={(e) => { e.target.style.borderColor = '#F0DCC8'; }}
            />
          </div>
          {/* Discount type */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Loại giảm giá
            </label>
            <div className="flex gap-3">
              {(['percent', 'fixed'] as const).map((t) => (
                <button key={t} onClick={() => setDiscountType(t)}
                  className="flex-1 py-2.5 rounded-xl border transition-all text-sm"
                  style={{
                    background: discountType === t ? '#F58220' : 'white',
                    color: discountType === t ? 'white' : '#A0845C',
                    borderColor: discountType === t ? '#F58220' : '#F0DCC8',
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600
                  }}>
                  {t === 'percent' ? '% Phần trăm' : '₫ Số tiền cố định'}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Mức giảm {discountType === 'percent' ? '(%)' : '(đ)'}
              </label>
              <input placeholder={discountType === 'percent' ? '20' : '30000'} className="w-full px-4 rounded-xl border outline-none"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Đơn tối thiểu (đ)
              </label>
              <input placeholder="100000" className="w-full px-4 rounded-xl border outline-none"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Số lượng phát hành
              </label>
              <input placeholder="500" className="w-full px-4 rounded-xl border outline-none"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Ngày hết hạn
              </label>
              <input type="date" className="w-full px-4 rounded-xl border outline-none"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t flex gap-3 flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: '#F0DCC8', color: '#A0845C', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
          <button 
            onClick={() => {
              showToast.success('Đã tạo Voucher thành công!');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
            style={{ background: '#F58220', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            Tạo Voucher
          </button>
        </div>
      </div>
    </div>
  );
}

export function VoucherManagement() {
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { visibleData, isLoading, isLoadingMore, loadMore, hasMore } = useInfiniteScroll(vouchers, 6);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {showForm && <VoucherForm onClose={() => setShowForm(false)} />}

      <div className="section-enter mb-6 flex flex-col gap-4 rounded-[28px] border border-[#F0DCC8] bg-[linear-gradient(135deg,#FFF8F2_0%,#FFFFFF_68%)] p-4 shadow-[0_16px_40px_rgba(93,46,15,0.05)] lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            Voucher & Ưu đãi
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C', marginTop: '4px' }}>
            Quản lý các mã giảm giá cho khách hàng. Hệ thống tự động áp dụng ưu đãi khi khách nhập mã lúc thanh toán.
            Hiện có <strong>{vouchers.filter(v => v.status === 'active').length}</strong> voucher đang hoạt động.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <label className="flex flex-1 min-w-[120px] items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer hover:bg-gray-50 sm:flex-none"
            style={{ borderColor: '#F0DCC8', color: '#A0845C', fontWeight: 600, fontSize: '13px' }}>
            <Upload size={16} /> <span>Nhập File</span>
            <input type="file" className="hidden" accept=".csv" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                showToast.loading('Đang xử lý file CSV...');
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const text = event.target?.result as string;
                    const lines = text.split('\n').filter(l => l.trim() !== '');
                    if (lines.length > 1) {
                      for (let i = 1; i < lines.length; i++) {
                        const cols = lines[i].split(',');
                        if (cols.length >= 3) {
                          vouchers.unshift({
                            id: 'VC' + Math.floor(100 + Math.random() * 900),
                            code: cols[0].trim().toUpperCase() || 'NEWCODE',
                            discount: cols[1].trim() || '10%',
                            type: cols[2].trim() === 'cash' ? 'cash' : 'percent',
                            minOrder: parseInt(cols[3]?.trim()) || 0,
                            usage: { current: 0, max: parseInt(cols[4]?.trim()) || 100 },
                            expires: '2026-12-31',
                            status: 'active',
                            desc: 'Voucher nhập từ file',
                          });
                        }
                      }
                      setTimeout(() => {
                        showToast.dismiss();
                        showToast.success(`Đã nhập thành công ${lines.length - 1} voucher!`);
                        setCopiedCode('refresh'); setTimeout(() => setCopiedCode(null), 10);
                      }, 1000);
                    } else {
                      showToast.dismiss(); showToast.error('File CSV trống hoặc sai định dạng');
                    }
                  } catch (err) {
                    showToast.dismiss(); showToast.error('Lỗi khi đọc file');
                  }
                };
                reader.readAsText(file);
                e.target.value = '';
              }
            }} />
          </label>
          <button onClick={() => setShowForm(true)}
            className="flex flex-1 min-w-[160px] items-center justify-center gap-2 px-4 py-2.5 rounded-2xl shadow-[0_14px_28px_rgba(245,130,32,0.22)] sm:flex-none"
            style={{ background: '#F58220', color: 'white', fontWeight: 600, fontSize: '13px' }}>
            <Plus size={16} /> <span className="whitespace-nowrap">Tạo Voucher mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-compact mb-6">
        {[
          { label: 'Đang hoạt động', value: vouchers.filter(v => v.status === 'active').length, icon: <CheckCircle2 size={20} style={{ color: '#9A3412' }} />, bg: '#FFEDD5' },
          { label: 'Tổng lượt dùng', value: vouchers.reduce((a, v) => a + (v.used || (v as any).usage?.current || 0), 0), icon: <Tag size={20} style={{ color: '#1E40AF' }} />, bg: '#EFF6FF' },
          { label: 'Đã hết hạn', value: vouchers.filter(v => v.status === 'expired').length, icon: <Clock size={20} style={{ color: '#92400E' }} />, bg: '#FEF3C7' },
        ].map((s, i) => (
          <div key={i} className="compact-stat-card p-3 md:p-4 flex flex-col items-center gap-2 text-center"
            style={{ boxShadow: '0 10px 24px rgba(93,46,15,0.05)' }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#A0845C' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={`skeleton-${i}`} className="rounded-2xl border" style={{ borderColor: '#F0DCC8', background: 'white' }}>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-7 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="flex justify-end mt-4"><Skeleton className="h-8 w-24 rounded-lg" /></div>
              </div>
              <div className="px-5 py-4 border-t" style={{ borderColor: '#F0DCC8' }}>
                <div className="flex justify-between mb-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleData.map((v) => {
              const used = v.used || (v as any).usage?.current || 0;
              const total = v.total || (v as any).usage?.max || 100;
              const usagePercent = Math.round((used / total) * 100);
              const isExpired = v.status === 'expired';
              return (
                <div key={v.id} className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                  style={{ background: 'white', border: '1px solid #F0DCC8', opacity: isExpired ? 0.75 : 1 }}>
                  
                  {/* Top section */}
                  <div className="p-5 relative overflow-hidden" 
                       style={{ background: isExpired ? '#F3F4F6' : 'linear-gradient(135deg, #FFF3E6 0%, #F5C088 100%)' }}>
                    {!isExpired && (
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white opacity-20 blur-xl pointer-events-none" />
                    )}
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '20px', fontWeight: 800, color: isExpired ? '#6B7280' : '#5D2E0F', letterSpacing: '0.05em' }}>{v.code}</div>
                        <div style={{ fontSize: '13.5px', color: isExpired ? '#9CA3AF' : '#F58220', marginTop: '4px', fontWeight: 500 }}>{v.name}</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '26px', fontWeight: 900, color: isExpired ? '#6B7280' : '#5D2E0F' }}>
                          {v.type === 'percent' ? `${v.discount}%` : formatVND(v.discount)}
                        </div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" 
                             style={{ background: isExpired ? 'rgba(0,0,0,0.05)' : 'rgba(27,67,50,0.1)', color: isExpired ? '#6B7280' : '#5D2E0F' }}>
                          Giảm giá
                        </div>
                      </div>
                    </div>

                    {/* Copy button */}
                    <div className="relative z-10 mt-4 flex justify-end">
                      <button onClick={() => copyCode(v.code)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '12px', color: isExpired ? '#6B7280' : '#F58220', fontWeight: 600 }}>
                        {copiedCode === v.code ? <CheckCircle2 size={14} style={{ color: '#9A3412' }} /> : <Copy size={14} />}
                        {copiedCode === v.code ? 'Đã chép' : 'Sao chép mã'}
                      </button>
                    </div>
                  </div>

                  {/* Dashed divider with ticket cutouts */}
                  <div className="relative flex items-center h-4 bg-white">
                    <div className="absolute left-[-8px] w-4 h-4 rounded-full" style={{ background: '#F5F5F5', borderRight: '1px solid #F0DCC8' }} />
                    <div className="w-full border-t-[2px] border-dashed" style={{ borderColor: '#F0DCC8' }} />
                    <div className="absolute right-[-8px] w-4 h-4 rounded-full" style={{ background: '#F5F5F5', borderLeft: '1px solid #F0DCC8' }} />
                  </div>

                  {/* Bottom section */}
                  <div className="px-5 pb-5 pt-2">
                    <div className="flex justify-between text-[13px] mb-3" style={{ color: '#A0845C' }}>
                      <span className="flex items-center gap-1.5"><AlertCircle size={14} /> Tối thiểu: {formatVND(v.minOrder)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> HSD: {v.expiry}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '12px', color: '#1A1A1A', fontWeight: 600 }}>Đã dùng: {used}/{total}</span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: isExpired ? '#F3F4F6' : '#FFEDD5', color: isExpired ? '#9CA3AF' : '#9A3412' }}>
                        {isExpired ? 'Đã kết thúc' : 'Đang phát hành'}
                      </span>
                    </div>
                    
                    {/* Progress */}
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${usagePercent}%`, background: usagePercent >= 90 ? '#EF4444' : '#F58220' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {!isLoading && visibleData.length === 0 && (
            <div className="mt-8">
              <EmptyState 
                icon={<Ticket size={28} />}
                title="Chưa có voucher nào"
                description="Hệ thống hiện tại chưa có voucher nào, hoặc voucher không khớp với điều kiện lọc."
              />
            </div>
          )}

          {/* Load More Button */}
          {hasMore && visibleData.length > 0 && (
            <div className="flex justify-center mt-10 mb-4">
              <button onClick={loadMore} disabled={isLoadingMore}
                className="flex items-center gap-2 px-8 py-3 rounded-xl border transition-all hover:-translate-y-0.5"
                style={{ background: 'white', borderColor: '#F0DCC8', color: '#F58220', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(45, 106, 79, 0.08)' }}>
                {isLoadingMore ? <Loader2 size={18} className="animate-spin" /> : null}
                {isLoadingMore ? 'Đang tải thêm...' : 'Xem thêm Voucher'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
