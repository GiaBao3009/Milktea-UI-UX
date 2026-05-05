import { api, API_BASE } from '@app/services/api';

export interface RevenueOverview {
  totalRevenue: number;
  totalOrders: number;
  profit: number;
  revenueChange: number;
  ordersChange: number;
  profitChange: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
}

export interface TopProduct {
  name: string;
  revenue: number;
  percentage: number;
  orders?: number;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function normalizeOverview(value: unknown): RevenueOverview {
  const data = asRecord(value);
  return {
    totalRevenue: toNumber(data.totalRevenue ?? data.revenue ?? data.total_revenue),
    totalOrders: toNumber(data.totalOrders ?? data.orders ?? data.total_orders),
    profit: toNumber(data.profit),
    revenueChange: toNumber(data.revenueChange ?? data.revenue_change),
    ordersChange: toNumber(data.ordersChange ?? data.orders_change),
    profitChange: toNumber(data.profitChange ?? data.profit_change),
  };
}

function normalizeRevenueByDay(value: unknown): RevenueByDay {
  const data = asRecord(value);
  return {
    date: String(data.date ?? data.day ?? data.label ?? ''),
    revenue: toNumber(data.revenue),
    orders: toNumber(data.orders),
    profit: toNumber(data.profit),
  };
}

function normalizeTopProduct(value: unknown): TopProduct {
  const data = asRecord(value);
  return {
    name: String(data.name ?? data.productName ?? data.product ?? 'Sản phẩm'),
    revenue: toNumber(data.revenue ?? data.totalRevenue ?? data.amount),
    percentage: toNumber(data.percentage ?? data.rate ?? data.percent),
    orders: toNumber(data.orders ?? data.quantity ?? data.totalOrders),
  };
}

const MOCK_OVERVIEW: RevenueOverview = {
  totalRevenue: 92.5, totalOrders: 1285, profit: 38.2,
  revenueChange: 15.2, ordersChange: 8.5, profitChange: 12.3,
};

const MOCK_BY_DAY: RevenueByDay[] = [
  { date: '20/04', revenue: 8.5, orders: 120, profit: 3.2 },
  { date: '21/04', revenue: 9.2, orders: 135, profit: 3.5 },
  { date: '22/04', revenue: 7.8, orders: 110, profit: 2.9 },
  { date: '23/04', revenue: 10.5, orders: 150, profit: 4.1 },
  { date: '24/04', revenue: 11.2, orders: 165, profit: 4.5 },
  { date: '25/04', revenue: 9.8, orders: 140, profit: 3.8 },
  { date: '26/04', revenue: 12.5, orders: 180, profit: 5.0 },
  { date: '27/04', revenue: 11.8, orders: 170, profit: 4.7 },
];

const MOCK_TOP: TopProduct[] = [
  { name: 'Trà Sữa Trân Châu', revenue: 25.5, percentage: 28, orders: 145 },
  { name: 'Trà Đào Cam Sả', revenue: 18.3, percentage: 20, orders: 128 },
  { name: 'Cà Phê Sữa', revenue: 15.2, percentage: 17, orders: 98 },
  { name: 'Oolong Macchiato', revenue: 12.1, percentage: 13, orders: 86 },
  { name: 'Hồng Trà Sữa', revenue: 9.8, percentage: 11, orders: 72 },
];

export const reportService = {
  async getOverview(): Promise<RevenueOverview> {
    if (!API_BASE) return MOCK_OVERVIEW;
    const res = await api.get<RevenueOverview>('/api/reports/revenue-overview');
    return normalizeOverview(res);
  },

  async getRevenueByDay(from?: string, to?: string): Promise<RevenueByDay[]> {
    if (!API_BASE) return MOCK_BY_DAY;
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const qs = params.toString();
    const res = await api.get<RevenueByDay[] | { data: RevenueByDay[] }>(`/api/reports/revenue-by-day${qs ? '?' + qs : ''}`);
    const rows = Array.isArray(res) ? res : res.data;
    return asArray(rows).map(normalizeRevenueByDay);
  },

  async getTopProducts(): Promise<TopProduct[]> {
    if (!API_BASE) return MOCK_TOP;
    const res = await api.get<TopProduct[] | { data: TopProduct[] }>('/api/reports/top-products');
    const rows = Array.isArray(res) ? res : res.data;
    return asArray(rows).map(normalizeTopProduct);
  },
};
