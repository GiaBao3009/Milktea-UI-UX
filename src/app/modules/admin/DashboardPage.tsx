import { useEffect, useMemo, useState, type ElementType } from "react";
import { useTrans } from "@app/hooks/useTranslation";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  DollarSign,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router";
import {
  reportService,
  type RevenueByDay,
  type TopProduct,
} from "@app/modules/system/services/reportService";
import {
  orderApiService,
  type AdminOrder,
} from "@app/modules/order/services/orderApiService";
import { toast } from "sonner";

const statusClassMap: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELED: "bg-red-100 text-red-700",
};

const statusLabelMap: Record<string, string> = {
  PENDING: "admin.dashboard.status.pending",
  PAID: "admin.dashboard.status.paid",
  COMPLETED: "admin.dashboard.status.completed",
  CANCELED: "admin.dashboard.status.canceled",
};

const money = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(value));

const vndFromMillion = (valueInMillion: number) => {
  const value = valueInMillion * 1_000_000;
  return formatVnd(value);
};

const formatVnd = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 2,
    }).format(value / 1_000_000_000)} tỷ ₫`;
  }

  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 2,
    }).format(value / 1_000_000)} triệu ₫`;
  }

  return `${money(value)} ₫`;
};

function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: ElementType;
  tone: "orange" | "blue" | "green" | "amber";
}) {
  const { t } = useTrans();
  const toneClass = {
    orange: "bg-orange-100 text-[#fb6514]",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  }[tone];

  return (
    <div className="min-w-0 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm sm:p-5 xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300 sm:text-base">{title}</p>
          <p className="mt-2 whitespace-nowrap text-[clamp(1.75rem,2.15vw,2.5rem)] font-bold leading-none text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex min-w-0 items-center gap-2">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-emerald-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`text-sm font-bold ${isPositive ? "text-emerald-600" : "text-red-500"
            }`}
        >
          {change}
        </span>
        <span className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{t("admin.dashboard.compared_to_last_period")}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTrans();
  const [loading, setLoading] = useState(true);
  const [byDay, setByDay] = useState<RevenueByDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    profit: 0,
    revenueChange: 0,
    ordersChange: 0,
    profitChange: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [overviewData, revenueData, topData, orderData] =
          await Promise.all([
            reportService.getOverview(),
            reportService.getRevenueByDay(),
            reportService.getTopProducts(),
            orderApiService.getAll(),
          ]);

        setOverview(overviewData);
        setByDay(revenueData);
        setTopProducts(topData.slice(0, 5));
        setRecentOrders(orderData.slice(0, 4));
      } catch {
        toast.error(t("admin.dashboard.error_loading"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const averageOrder = useMemo(() => {
    if (!overview.totalOrders) return 0;
    return Math.round((overview.totalRevenue * 1_000_000) / overview.totalOrders);
  }, [overview.totalOrders, overview.totalRevenue]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#fb6514]" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("admin.dashboard.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1518px]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between xl:mb-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-4xl">
            {t("admin.dashboard.title")}
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            {t("admin.dashboard.subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-12 items-center gap-3 self-start rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm"
        >
          <Calendar className="h-4 w-4" />
          {t("admin.dashboard.last_30_days")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5 2xl:gap-8">
        <MetricCard
          title={t("admin.dashboard.total_revenue")}
          value={vndFromMillion(overview.totalRevenue)}
          change={`+${overview.revenueChange}%`}
          isPositive={overview.revenueChange >= 0}
          icon={DollarSign}
          tone="orange"
        />
        <MetricCard
          title={t("admin.dashboard.total_orders")}
          value={overview.totalOrders.toLocaleString("vi-VN")}
          change={`+${overview.ordersChange}%`}
          isPositive={overview.ordersChange >= 0}
          icon={ShoppingCart}
          tone="blue"
        />
        <MetricCard
          title={t("admin.dashboard.profit")}
          value={vndFromMillion(overview.profit)}
          change={`+${overview.profitChange}%`}
          isPositive={overview.profitChange >= 0}
          icon={TrendingUp}
          tone="green"
        />
        <MetricCard
          title={t("admin.dashboard.avg_order_value")}
          value={formatVnd(averageOrder)}
          change="+0%"
          isPositive
          icon={Package}
          tone="amber"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.9fr)] xl:gap-6 2xl:mt-8 2xl:gap-8">
        <section className="min-w-0 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
                {t("admin.dashboard.revenue_by_day")}
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{t("admin.dashboard.month_04_2026")}</p>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("admin.dashboard.revenue_m")}</p>
          </div>

          <div className="h-[300px] sm:h-[340px] xl:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name={t("admin.dashboard.revenue")}
                  stroke="#fb6514"
                  strokeWidth={3}
                  dot={{ fill: "#fb6514", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="flex min-w-0 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex w-full flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-5 sm:px-6 xl:px-8">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
                {t("admin.dashboard.recent_orders")}
              </h2>
            </div>
            <div className="flex-1 px-5 py-4 sm:px-6 xl:px-8">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                      {order.id}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {order.customer?.name || t("admin.dashboard.retail_customer")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      {order.total.toLocaleString("vi-VN")}đ
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClassMap[order.status] || statusClassMap.PENDING
                        }`}
                    >
                      {t(statusLabelMap[order.status]) || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/admin/orders"
              className="mb-6 inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-950 dark:text-white hover:text-[#fb6514]"
            >
              {t("admin.dashboard.view_all_orders")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm sm:p-6 2xl:mt-8">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
          {t("admin.dashboard.top_selling_products")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {topProducts.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-sm font-extrabold text-[#fb6514]">
                #{index + 1}
              </div>
              <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-slate-950 dark:text-white">
                {product.name}
              </h3>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{t("admin.dashboard.revenue")}</span>
                  <span className="font-bold text-[#fb6514]">
                    {vndFromMillion(product.revenue)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{t("admin.dashboard.proportion")}</span>
                  <span className="font-bold text-slate-950 dark:text-white">
                    {product.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

