import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Plus, Search, Edit2, Trash2, X, ChevronDown, Shield, Users } from "lucide-react";
import { staff } from "@app/constants/mockData";

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

type Staff = typeof staff[0];

const roles = ['Tất cả', 'Quản lý chi nhánh', 'Pha chế viên', 'Thu ngân', 'Giao hàng'];

const roleColors: Record<string, { bg: string; color: string }> = {
  'Quản lý chi nhánh': { bg: '#FFF3E6', color: '#F58220' },
  'Pha chế viên': { bg: '#EFF6FF', color: '#1E40AF' },
  'Thu ngân': { bg: '#FEF9C3', color: '#854D0E' },
  'Giao hàng': { bg: '#F3F4F6', color: '#374151' },
};

interface StaffFormProps {
  member?: Staff | null;
  onClose: () => void;
}

function StaffForm({ member, onClose }: StaffFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl flex flex-col"
        style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F0DCC8' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
            {member ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={16} style={{ color: '#A0845C' }} /></button>
        </div>
        <div className="px-5 py-5 space-y-4 overflow-y-auto flex-1">
          {[
            { label: 'Họ và tên', placeholder: 'Nguyễn Văn A', value: member?.name || '' },
            { label: 'Số điện thoại', placeholder: '09xxxxxxxx', value: member?.phone || '' },
            { label: 'Email', placeholder: 'ten@smyou.vn', value: member?.email || '' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{f.label}</label>
              <input defaultValue={f.value} placeholder={f.placeholder}
                className="w-full px-4 rounded-xl border outline-none transition-all"
                style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                onFocus={(e) => e.target.style.borderColor = '#F5C088'}
                onBlur={(e) => e.target.style.borderColor = '#F0DCC8'}
              />
            </div>
          ))}
          {[
            { label: 'Chức vụ', options: ['Quản lý chi nhánh', 'Pha chế viên', 'Thu ngân', 'Giao hàng'], value: member?.role || 'Pha chế viên' },
            { label: 'Chi nhánh', options: ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Thủ Đức'], value: member?.branch || 'Quận 1' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{f.label}</label>
              <div className="relative">
                <select defaultValue={f.value} className="w-full px-4 rounded-xl border outline-none appearance-none"
                  style={{ height: '44px', borderColor: '#F0DCC8', fontSize: '13.5px', fontFamily: "'Be Vietnam Pro', sans-serif", background: 'white' }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
              </div>
            </div>
          ))}
          {/* Permissions */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '8px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <Shield size={13} className="inline mr-1" style={{ color: '#F58220' }} /> Quyền truy cập
            </label>
            <div className="space-y-2">
              {[
                { label: 'Xem đơn hàng', checked: true },
                { label: 'Quản lý đơn hàng', checked: member?.role === 'Quản lý chi nhánh' },
                { label: 'Xem báo cáo', checked: member?.role === 'Quản lý chi nhánh' },
                { label: 'Quản lý menu', checked: false },
              ].map(p => (
                <label key={p.label} className="flex items-center gap-2.5 cursor-pointer">
                  <div className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ background: p.checked ? '#F58220' : 'white', border: `1.5px solid ${p.checked ? '#F58220' : '#D1D5DB'}` }}>
                    {p.checked && <div className="w-2 h-2 rounded-sm" style={{ background: 'white' }} />}
                  </div>
                  <span style={{ fontSize: '13px', color: '#1A1A1A' }}>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t flex gap-3 flex-shrink-0" style={{ borderColor: '#F0DCC8' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: '#F0DCC8', color: '#A0845C', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
          <button className="flex-1 py-2.5 rounded-xl text-sm"
            style={{ background: '#F58220', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
            {member ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StaffManagement() {
  const [activeRole, setActiveRole] = useState('Tất cả');
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [search, setSearch] = useState('');

  const filtered = staff.filter(s =>
    (activeRole === 'Tất cả' || s.role === activeRole) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(filtered, 5);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {showForm && <StaffForm member={editStaff} onClose={() => { setShowForm(false); setEditStaff(null); }} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>
            Quản lý Nhân viên
          </h1>
          <p style={{ fontSize: '13.5px', color: '#A0845C' }}>{staff.length} nhân viên · {staff.filter(s => s.status === 'active').length} đang hoạt động</p>
        </div>
        <button onClick={() => { setEditStaff(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl w-full sm:w-auto"
          style={{ background: '#F58220', color: 'white', fontWeight: 600, fontSize: '13.5px' }}>
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm nhân viên..."
            className="w-full pl-9 pr-4 rounded-xl border outline-none"
            style={{ height: '40px', borderColor: '#F0DCC8', fontSize: '13px', background: 'white' }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {roles.map(r => (
            <button key={r} onClick={() => setActiveRole(r)}
              className="px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background: activeRole === r ? '#F58220' : 'white',
                color: activeRole === r ? 'white' : '#A0845C',
                border: `1px solid ${activeRole === r ? '#F58220' : '#F0DCC8'}`,
                fontWeight: activeRole === r ? 600 : 400,
                fontSize: '12.5px'
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden rounded-xl overflow-hidden" style={{ background: 'white', border: '0.5px solid #F0DCC8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#F0DCC8', background: '#FFF3E6' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F58220' }}>{filtered.length} nhân viên</span>
        </div>
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b flex items-center gap-3" style={{ borderColor: '#FAF0E6' }}>
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1"><Skeleton className="h-4 w-32 mb-1.5" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="py-10"><EmptyState icon={<Users size={28} />} title="Không tìm thấy nhân viên" description="Không có nhân viên nào khớp." /></div>
        ) : (
          paginatedData.map((s) => {
            const roleCfg = roleColors[s.role] || { bg: '#F3F4F6', color: '#6B7280' };
            return (
              <div key={s.id} className="p-4 border-b flex items-start gap-3" style={{ borderColor: '#FAF0E6' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5C088', color: '#5D2E0F', fontWeight: 700, fontSize: '14px' }}>{s.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{s.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.status === 'active' ? '#FFEDD5' : '#FEE2E2', color: s.status === 'active' ? '#9A3412' : '#991B1B' }}>{s.status === 'active' ? 'Hoạt động' : 'Nghỉ việc'}</span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs" style={{ background: roleCfg.bg, color: roleCfg.color }}>{s.role}</span>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap" style={{ fontSize: '12px', color: '#A0845C' }}>
                    <span>{s.branch}</span><span>·</span><span>{s.phone}</span><span>·</span><span>{s.joinDate}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditStaff(s); setShowForm(true); }} className="p-2 rounded-lg border" style={{ borderColor: '#F0DCC8' }}><Edit2 size={13} style={{ color: '#F58220' }} /></button>
                  <button className="p-2 rounded-lg border" style={{ borderColor: '#FCBABD' }}><Trash2 size={13} style={{ color: '#8B3A4A' }} /></button>
                </div>
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
              {['Nhân viên', 'Chức vụ', 'Chi nhánh', 'Liên hệ', 'Ngày vào', 'Trạng thái', 'Hành động'].map(h => (
                <th key={h} className="text-left px-5 py-3" style={{ fontSize: '12px', fontWeight: 600, color: '#F58220', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b" style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-4 w-24 mb-1" /></div></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-32" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-5 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-5 py-3.5"><div className="flex gap-2"><Skeleton className="h-7 w-7 rounded-lg" /><Skeleton className="h-7 w-7 rounded-lg" /></div></td>
                </tr>
              ))
            ) : (
              paginatedData.map((s, i) => {
                const roleCfg = roleColors[s.role] || { bg: '#F3F4F6', color: '#6B7280' };
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#FAF0E6', background: i % 2 === 1 ? '#FFFCF8' : 'white' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#F5C088', color: '#5D2E0F', fontWeight: 700, fontSize: '13px' }}>{s.name[0]}</div>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A' }}>{s.name}</div>
                          <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: roleCfg.bg, color: roleCfg.color }}>{s.role}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '13px', color: '#A0845C' }}>{s.branch}</span></td>
                    <td className="px-5 py-3.5">
                      <div style={{ fontSize: '13px', color: '#1A1A1A' }}>{s.phone}</div>
                      <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{s.email}</div>
                    </td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: '12px', color: '#A0845C' }}>{s.joinDate}</span></td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.status === 'active' ? '#FFEDD5' : '#FEE2E2', color: s.status === 'active' ? '#9A3412' : '#991B1B' }}>{s.status === 'active' ? 'Hoạt động' : 'Nghỉ việc'}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditStaff(s); setShowForm(true); }} className="p-2 rounded-lg border hover:bg-gray-50" style={{ borderColor: '#F0DCC8' }}><Edit2 size={13} style={{ color: '#F58220' }} /></button>
                        <button className="p-2 rounded-lg border hover:bg-pink-50" style={{ borderColor: '#FCBABD' }}><Trash2 size={13} style={{ color: '#8B3A4A' }} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
        {!isLoading && paginatedData.length === 0 && (
          <div className="py-10"><EmptyState icon={<Users size={28} />} title="Không tìm thấy nhân viên" description="Không có nhân viên nào khớp với điều kiện lọc." /></div>
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
