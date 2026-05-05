import { useMemo, useState } from "react";
import {
  Search, Filter, FileText, CheckCircle2, AlertTriangle,
  XCircle, Activity, SearchX, Shield, ChevronDown
} from "lucide-react";
import { showToast } from "@app/utils/toast";
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

const mockLogs = [
  { id: "LOG-001", user: "Admin Chips", role: "Super Admin", action: "CREATE", target: "Product", detail: 'Thêm sản phẩm "Trà Sữa Oolong Nướng"', time: "10:25:34 20/04/2026", ip: "192.168.1.45", status: "success" },
  { id: "LOG-002", user: "Nguyễn Văn Bình", role: "Quản lý chi nhánh", action: "UPDATE", target: "Order", detail: 'Cập nhật trạng thái đơn hàng ORD-2412002 thành "Đang pha chế"', time: "10:42:12 20/04/2026", ip: "118.69.23.11", status: "success" },
  { id: "LOG-003", user: "Lê Thị Thu", role: "Quản lý chi nhánh", action: "DELETE", target: "Topping", detail: 'Xóa topping "Nata De Coco"', time: "09:15:00 20/04/2026", ip: "14.161.45.12", status: "success" },
  { id: "LOG-004", user: "System", role: "System", action: "LOGIN_FAILED", target: "Auth", detail: "Cảnh báo: Đăng nhập sai mật khẩu 5 lần liên tiếp", time: "08:30:22 20/04/2026", ip: "103.11.23.44", status: "warning" },
  { id: "LOG-005", user: "Admin Chips", role: "Super Admin", action: "EXPORT", target: "Report", detail: "Xuất báo cáo doanh thu tháng 3/2026", time: "16:45:10 19/04/2026", ip: "192.168.1.45", status: "success" },
  { id: "LOG-006", user: "Trần Thị Ngọc", role: "Quản lý chi nhánh", action: "UPDATE", target: "Settings", detail: "Thay đổi giờ mở cửa chi nhánh Quận 1", time: "14:20:05 19/04/2026", ip: "113.190.45.67", status: "success" },
  { id: "LOG-007", user: "Unknown", role: "Guest", action: "UNAUTHORIZED_ACCESS", target: "System", detail: "Cố gắng truy cập API /api/v1/settings không có token", time: "02:15:00 19/04/2026", ip: "45.112.33.11", status: "error" },
];

const actionColors: Record<string, { bg: string; color: string }> = {
  CREATE: { bg: "#FFEDD5", color: "#9A3412" },
  UPDATE: { bg: "#EFF6FF", color: "#1E40AF" },
  DELETE: { bg: "#FEE2E2", color: "#991B1B" },
  EXPORT: { bg: "#FEF3C7", color: "#92400E" },
  LOGIN_FAILED: { bg: "#FEF3C7", color: "#92400E" },
  UNAUTHORIZED_ACCESS: { bg: "#FEE2E2", color: "#991B1B" },
};

const statusIcons: Record<string, JSX.Element> = {
  success: <CheckCircle2 size={14} style={{ color: "#2E7D32" }} />,
  warning: <AlertTriangle size={14} style={{ color: "#92400E" }} />,
  error: <XCircle size={14} style={{ color: "#991B1B" }} />,
};

const statusLabels: Record<string, string> = {
  success: "An toàn",
  warning: "Cảnh báo",
  error: "Rủi ro",
};

export function AuditLog() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    showToast.loading("Đang chuẩn bị dữ liệu xuất...");
    setTimeout(() => {
      setIsExporting(false);
      showToast.dismiss();
      showToast.success("Xuất CSV thành công", { description: "File audit_log_2026.csv đã được tải xuống." });
      
      const blob = new Blob(["id,user,role,action,target,time,ip,status\nLOG-001,Admin Chips,Super Admin,CREATE,Product,10:25:34 20/04/2026,192.168.1.45,success"], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit_log_2026.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const filtered = useMemo(
    () =>
      mockLogs.filter((log) => {
        const normalizedSearch = search.toLowerCase();
        const matchesSearch =
          log.user.toLowerCase().includes(normalizedSearch) ||
          log.detail.toLowerCase().includes(normalizedSearch) ||
          log.action.toLowerCase().includes(normalizedSearch) ||
          log.target.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === "all" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter]
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(filtered, 6);

  const stats = [
    { label: "Tổng log", value: filtered.length, bg: "#FFF3E6", color: "#F58220", icon: <Activity size={18} /> },
    { label: "Cảnh báo", value: filtered.filter((log) => log.status === "warning").length, bg: "#FEF3C7", color: "#92400E", icon: <AlertTriangle size={18} /> },
    { label: "Lỗi truy cập", value: filtered.filter((log) => log.status === "error").length, bg: "#FEE2E2", color: "#991B1B", icon: <Shield size={18} /> },
  ];

  return (
    <div className="space-y-5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <section className="section-enter rounded-[28px] border border-[#F0DCC8] bg-[linear-gradient(135deg,#FFF8F2_0%,#FFFFFF_68%)] p-4 shadow-[0_16px_40px_rgba(93,46,15,0.05)] sm:p-5">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full bg-[#FFF1E1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F58220]">
            Audit Preview
          </div>
          <h1 className="mt-3 flex items-center gap-2 font-heading text-[28px] font-bold text-[#1A1A1A]">
            <Activity size={26} className="text-[#F58220]" />
            Nhật ký hệ thống
          </h1>
          <p className="mt-2 text-[13.5px] leading-6 text-[#A0845C]">
            Preview nhanh hoạt động hệ thống, xem target, user, địa chỉ IP và mức độ rủi ro ngay trong bảng.
          </p>
        </div>

        <div className="stats-grid-compact mt-5">
          {stats.map((item) => (
            <div key={item.label} className="compact-stat-card p-3 sm:p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <div className="font-heading text-[22px] font-bold text-[#1A1A1A]">{item.value}</div>
              <div className="text-[12px] text-[#A0845C]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#F0DCC8] bg-white shadow-[0_12px_30px_rgba(93,46,15,0.05)]">
        <div className="flex flex-col gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: "#F0DCC8" }}>
          <div className="relative flex-1 lg:max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo user, hành động, target, chi tiết..."
              className="h-12 w-full rounded-2xl border bg-white pl-11 pr-4 outline-none transition-all focus:border-[#F5C088] focus:shadow-[0_0_0_4px_rgba(245,192,136,0.16)]"
              style={{ borderColor: "#F0DCC8" }}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[200px]">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border bg-white pl-11 pr-10 outline-none"
                style={{ borderColor: "#F0DCC8" }}
              >
                <option value="all">Tất cả mức độ</option>
                <option value="success">An toàn</option>
                <option value="warning">Cảnh báo</option>
                <option value="error">Rủi ro</option>
              </select>
            </div>

            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#F0DCC8] px-4 text-sm font-semibold transition-colors ${isExporting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-[#1A1A1A] hover:bg-[#FFF8F1]'}`}
            >
              <FileText size={15} className={isExporting ? 'animate-pulse' : ''} />
              {isExporting ? 'Đang xuất...' : 'Xuất CSV'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "#FFF3E6" }}>
                {["Thời gian", "Người dùng", "Hành động", "Target", "Preview", "IP", "Mức độ"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF0E6]">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-72" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
                    </tr>
                  ))
                : paginatedData.map((log, index) => (
                    <tr key={log.id} className="transition-colors hover:bg-[#FFFBF7]" style={{ background: index % 2 === 1 ? "#FFFCF8" : "white" }}>
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-semibold text-[#1A1A1A]">{log.time}</div>
                        <div className="text-[11px] text-[#9CA3AF]">{log.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-semibold text-[#1A1A1A]">{log.user}</div>
                        <div className="text-[11px] text-[#9CA3AF]">{log.role}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: actionColors[log.action]?.bg || "#F3F4F6", color: actionColors[log.action]?.color || "#374151" }}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#FFF8F1] px-3 py-1 text-xs font-bold text-[#A0845C]">{log.target}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-[420px] line-clamp-2 text-[13px] leading-5 text-[#5C4A37]">{log.detail}</div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#A0845C]" style={{ fontFamily: "monospace" }}>{log.ip}</td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                          style={{
                            background: log.status === "success" ? "#E8F5E9" : log.status === "warning" ? "#FEF3C7" : "#FEE2E2",
                            color: log.status === "success" ? "#2E7D32" : log.status === "warning" ? "#92400E" : "#991B1B",
                          }}
                        >
                          {statusIcons[log.status]}
                          {statusLabels[log.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && paginatedData.length === 0 && (
          <div className="py-12">
            <EmptyState
              icon={<SearchX size={28} />}
              title="Không tìm thấy nhật ký"
              description="Không có bản ghi nào khớp với điều kiện hiện tại."
            />
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="border-t px-5 py-4" style={{ borderColor: "#F0DCC8" }}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1} className="cursor-pointer">
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}
