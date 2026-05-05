import { useEffect, useState } from 'react';
import { useTrans } from '@app/hooks/useTranslation';
import { motion } from 'motion/react';
import { Calendar, Download, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { reportService, type RevenueOverview, type RevenueByDay, type TopProduct } from '@app/modules/system/services/reportService';
import { toast } from 'sonner';

const money = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(Math.round(value));

const formatVnd = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 2,
    }).format(value / 1_000_000_000)} tỷ ₫`;
  }

  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 2,
    }).format(value / 1_000_000)} triệu ₫`;
  }

  return `${money(value)} ₫`;
};

const vndFromMillion = (valueInMillion: number) => formatVnd(valueInMillion * 1_000_000);

export default function ReportsPage() {
  const { t } = useTrans();
  const [overview, setOverview] = useState<RevenueOverview | null>(null);
  const [byDay, setByDay] = useState<RevenueByDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ov, days, top] = await Promise.all([
          reportService.getOverview(),
          reportService.getRevenueByDay(),
          reportService.getTopProducts(),
        ]);
        setOverview(ov);
        setByDay(days);
        setTopProducts(top);
      } catch {
        toast.error(t('admin.reports.error_loading'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = overview
    ? [
        { title: t('admin.reports.total_revenue'), value: vndFromMillion(overview.totalRevenue), change: `+${overview.revenueChange}%`, icon: DollarSign },
        { title: t('admin.reports.total_orders'), value: overview.totalOrders.toLocaleString(), change: `+${overview.ordersChange}%`, icon: TrendingUp },
        { title: t('admin.reports.profit'), value: vndFromMillion(overview.profit), change: `+${overview.profitChange}%`, icon: DollarSign },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.reports.title')}</h2>
          <p className="text-muted-foreground">{t('admin.reports.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-card border border-border rounded-lg flex items-center gap-2 hover:bg-secondary transition-colors text-sm">
            <Calendar className="w-4 h-4" /><span>{t('admin.reports.last_30_days')}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm">
            <Download className="w-4 h-4" /><span>{t('admin.reports.export_report')}</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <h3 className="font-bold text-lg mb-6">{t('admin.reports.revenue_profit_by_day')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
              <XAxis dataKey="date" stroke="#6c757d" fontSize={12} />
              <YAxis stroke="#6c757d" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '12px' }} />
              <Bar dataKey="revenue" name={t('admin.reports.revenue')} fill="#fb6514" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name={t('admin.reports.profit_label')} fill="#28a745" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-bold text-lg mb-6">{t('admin.reports.top_products')}</h3>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">{product.name}</span>
                  <span className="text-primary font-semibold shrink-0 ml-2">{vndFromMillion(product.revenue)}</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${product.percentage}%` }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                    className="absolute h-full bg-primary rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground">{product.percentage}{t('admin.reports.total_revenue_percent')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

