import { useMemo, useState } from "react";
import {
  Star, MessageSquare, User, Package, CheckCircle2, XCircle,
  Clock, Trash2, Filter, Search, Eye, ChevronDown, Loader2
} from "lucide-react";
import { reviews } from "@app/constants/mockData";
import { showToast } from "@app/utils/toast";
import { Skeleton } from "@app/components/ui/skeleton";
import { EmptyState } from "@app/components/ui/EmptyState";
import { useInfiniteScroll, usePagination } from "@app/hooks/useDataFetching";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@app/components/ui/pagination";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: JSX.Element }> = {
  approved: { label: "Đã duyệt", bg: "#E8F5E9", color: "#2E7D32", icon: <CheckCircle2 size={13} /> },
  pending: { label: "Chờ duyệt", bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} /> },
  rejected: { label: "Đã ẩn", bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} /> },
};

const reviewTypeConfig = {
  product: { label: "Sản phẩm", icon: <Package size={16} />, bg: "#FFF3E6", color: "#F58220" },
  staff: { label: "Nhân viên", icon: <User size={16} />, bg: "#EFF6FF", color: "#2563EB" },
};

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          fill={index < rating ? "#FBBF24" : "none"}
          color={index < rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

export function ReviewManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "product" | "staff">("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesTab = activeTab === "all" || review.type === activeTab;
        const normalizedSearch = search.toLowerCase();
        const matchesSearch =
          review.target.toLowerCase().includes(normalizedSearch) ||
          review.customer.toLowerCase().includes(normalizedSearch) ||
          review.comment.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === "all" || review.status === statusFilter;
        return matchesTab && matchesSearch && matchesStatus;
      }),
    [activeTab, search, statusFilter]
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData, isLoading } = usePagination(filtered, 6);
  const {
    visibleData,
    isLoading: cardsLoading,
    isLoadingMore,
    loadMore,
    hasMore,
  } = useInfiniteScroll(filtered, 4);

  const stats = [
    { label: "Tổng phản hồi", value: filtered.length, bg: "#FFF3E6", color: "#F58220", icon: <MessageSquare size={18} /> },
    { label: "Chờ duyệt", value: filtered.filter((review) => review.status === "pending").length, bg: "#FEF3C7", color: "#92400E", icon: <Clock size={18} /> },
    { label: "Điểm trung bình", value: (filtered.reduce((sum, review) => sum + review.rating, 0) / Math.max(filtered.length, 1)).toFixed(1), bg: "#FFF7D6", color: "#D97706", icon: <Star size={18} /> },
  ];

  const handleStatusChange = (id: string, status: string) => {
    showToast.success(`Đã cập nhật trạng thái đánh giá ${id} thành ${status}.`);
  };

  const handleDelete = (id: string) => {
    showToast.error(`Đã xóa đánh giá ${id}.`);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <section className="section-enter rounded-[28px] border border-[#F0DCC8] bg-[linear-gradient(135deg,#FFF8F2_0%,#FFFFFF_68%)] p-4 shadow-[0_16px_40px_rgba(93,46,15,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full bg-[#FFF1E1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F58220]">
              Review Center
            </div>
            <h1 className="mt-3 font-heading text-[28px] font-bold leading-tight text-[#1A1A1A]">Đánh giá, phản hồi và preview nhanh theo bảng.</h1>
            <p className="mt-2 text-[13.5px] leading-6 text-[#A0845C]">
              Mobile ưu tiên card và load thêm, còn desktop có bảng preview đầy đủ để duyệt nhanh theo trạng thái, loại phản hồi và khách hàng.
            </p>
          </div>
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

      <div className="chip-scroller border-b border-[#F0DCC8] pb-3">
        {[
          { id: "all", label: "Tất cả", icon: <MessageSquare size={16} /> },
          { id: "product", label: "Sản phẩm", icon: <Package size={16} /> },
          { id: "staff", label: "Nhân viên", icon: <User size={16} /> },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "all" | "product" | "staff")}
              className="flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                color: active ? "#FFFFFF" : "#A0845C",
                background: active ? "#F58220" : "rgba(255,255,255,0.84)",
                borderColor: active ? "#F58220" : "#F0DCC8",
                boxShadow: active ? "0 10px 22px rgba(245,130,32,0.18)" : "none",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="section-enter flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo khách hàng, mục đánh giá, nội dung..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 w-full rounded-2xl border bg-white pl-11 pr-4 outline-none transition-all focus:border-[#F5C088] focus:shadow-[0_0_0_4px_rgba(245,192,136,0.16)]"
            style={{ borderColor: "#F0DCC8" }}
          />
        </div>

        <div className="relative min-w-[210px]">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border bg-white pl-11 pr-10 outline-none transition-all"
            style={{ borderColor: "#F0DCC8" }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã ẩn</option>
          </select>
        </div>
      </div>

      <section className="hidden overflow-hidden rounded-[28px] border border-[#F0DCC8] bg-white shadow-[0_12px_30px_rgba(93,46,15,0.05)] lg:block">
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "#F0DCC8" }}>
          <div>
            <h2 className="font-heading text-[16px] font-bold text-[#1A1A1A]">Preview dạng bảng</h2>
            <p className="text-[12px] text-[#A0845C]">Xem nhanh nội dung, điểm sao, trạng thái duyệt và người gửi.</p>
          </div>
          <div className="rounded-full bg-[#FFF7EF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F58220]">
            {filtered.length} phản hồi
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: "#FFF3E6" }}>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[150px]">Khách hàng</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[120px]">Loại</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[160px]">Mục đánh giá</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[300px]">Preview</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[130px]">Điểm</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[140px]">Trạng thái</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] min-w-[120px]">Ngày</th>
                <th className="px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F58220] text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF0E6]">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-20 rounded-full" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-64" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-24 rounded-2xl ml-auto" /></td>
                    </tr>
                  ))
                : paginatedData.map((review) => {
                    const type = reviewTypeConfig[review.type];
                    const status = statusConfig[review.status];
                    return (
                      <tr key={review.id} className="transition-colors hover:bg-[#FFFBF7]">
                        <td className="px-5 py-4">
                          <div className="text-[13px] font-semibold text-[#1A1A1A]">{review.customer}</div>
                          <div className="text-[11px] text-[#9CA3AF]">{review.id}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: type.bg, color: type.color }}>
                            {type.icon}
                            {type.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-[#1A1A1A]">{review.target}</td>
                        <td className="px-5 py-4">
                          <div className="max-w-[360px] line-clamp-2 text-[13px] leading-5 text-[#6B5A45]">{review.comment}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <ReviewStars rating={review.rating} />
                            <span className="text-[12px] font-semibold text-[#A0845C]">{review.rating}/5</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: status.bg, color: status.color }}>
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[12px] text-[#A0845C]">{review.date}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {review.status === "pending" && (
                              <button
                                onClick={() => handleStatusChange(review.id, "approved")}
                                className="rounded-2xl border border-[#D6EFD9] bg-[#F6FFF8] p-2.5 text-[#2E7D32] transition-all hover:bg-[#ECFFF0]"
                                title="Duyệt"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                            {review.status !== "rejected" && (
                              <button
                                onClick={() => handleStatusChange(review.id, "rejected")}
                                className="rounded-2xl border border-[#FEE2E2] bg-[#FFF8F8] p-2.5 text-[#991B1B] transition-all hover:bg-[#FFF1F1]"
                                title="Ẩn phản hồi"
                              >
                                <Eye size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="rounded-2xl border border-[#FCBABD] bg-white p-2.5 text-red-600 transition-all hover:bg-red-50"
                              title="Xóa"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {!isLoading && paginatedData.length === 0 && (
          <div className="py-14">
            <EmptyState
              icon={<Star size={40} />}
              title="Không tìm thấy phản hồi"
              description="Không có phản hồi nào khớp với bộ lọc hiện tại."
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

      <section className="space-y-4 lg:hidden">
        {cardsLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[24px] border border-[#F0DCC8] bg-white p-4">
                <Skeleton className="mb-3 h-5 w-28" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-9 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : visibleData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {visibleData.map((review) => {
                const type = reviewTypeConfig[review.type];
                const status = statusConfig[review.status];
                return (
                  <article key={review.id} className="rounded-[24px] border border-[#F0DCC8] bg-white p-4 shadow-[0_10px_24px_rgba(93,46,15,0.05)]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-bold text-[#1A1A1A]">{review.customer}</div>
                        <div className="mt-1 text-[11px] text-[#9CA3AF]">{review.date}</div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: status.bg, color: status.color }}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: type.bg, color: type.color }}>
                        {type.icon}
                        {type.label}
                      </span>
                      <span className="rounded-full bg-[#FFF7EF] px-3 py-1 text-[11px] font-bold text-[#A0845C]">{review.target}</span>
                    </div>

                    <ReviewStars rating={review.rating} />
                    <p className="mt-3 text-[13px] leading-6 text-[#5C4A37]">"{review.comment}"</p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {review.status === "pending" ? (
                        <button
                          onClick={() => handleStatusChange(review.id, "approved")}
                          className="rounded-2xl border border-[#D6EFD9] py-2.5 text-xs font-bold text-[#2E7D32]"
                        >
                          Duyệt
                        </button>
                      ) : (
                        <button className="rounded-2xl border border-[#F0DCC8] py-2.5 text-xs font-bold text-[#A0845C]">
                          Đã xử lý
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(review.id, "rejected")}
                        className="rounded-2xl border border-[#FEF3C7] py-2.5 text-xs font-bold text-[#92400E]"
                      >
                        Ẩn
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="rounded-2xl border border-[#FCBABD] py-2.5 text-xs font-bold text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="flex h-12 items-center gap-2 rounded-2xl border border-[#F5C088] bg-white px-6 text-sm font-bold text-[#F58220]"
                >
                  {isLoadingMore ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
                  {isLoadingMore ? "Đang tải..." : "Tải thêm phản hồi"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[24px] border border-[#F0DCC8] bg-white py-12">
            <EmptyState
              icon={<Star size={40} />}
              title="Chưa có đánh giá nào"
              description="Hiện tại chưa có phản hồi phù hợp với điều kiện tìm kiếm."
            />
          </div>
        )}
      </section>
    </div>
  );
}
