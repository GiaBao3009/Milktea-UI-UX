import { api, API_BASE } from '@app/services/api';

export interface AdminOrderItem {
  product: string;
  size: string;
  quantity: number;
  price: number;
}

export interface AdminOrderLog {
  action: string;
  time: string;
  user: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELED';
export type PaymentMethod = 'CASH' | 'VNPAY' | 'BANK_TRANSFER';

export interface AdminOrder {
  id: string;
  customer: { name: string; phone: string };
  branch: string;
  items: AdminOrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  logs?: AdminOrderLog[];
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

function normalizeOrderItem(item: unknown): AdminOrderItem {
  const data = asRecord(item);
  return {
    product: String(data.product ?? data.productName ?? data.name ?? ''),
    size: String(data.size ?? ''),
    quantity: toNumber(data.quantity),
    price: toNumber(data.price ?? data.unitPrice),
  };
}

function normalizeOrderLog(log: unknown): AdminOrderLog {
  const data = asRecord(log);
  return {
    action: String(data.action ?? data.message ?? ''),
    time: String(data.time ?? data.createdAt ?? ''),
    user: String(data.user ?? data.createdBy ?? ''),
  };
}

function normalizeOrder(order: unknown): AdminOrder {
  const data = asRecord(order);
  const customer = asRecord(data.customer);

  return {
    id: String(data.id ?? data.orderId ?? ''),
    customer: {
      name: String(
        customer.name
          ?? data.customerName
          ?? data.receiverName
          ?? data.fullName
          ?? data.name
          ?? 'Khách lẻ',
      ),
      phone: String(customer.phone ?? data.customerPhone ?? data.phone ?? ''),
    },
    branch: String(data.branch ?? data.branchName ?? ''),
    items: asArray(data.items).map(normalizeOrderItem),
    total: toNumber(data.total ?? data.totalAmount ?? data.amount),
    paymentMethod: String(data.paymentMethod ?? data.paymentType ?? 'CASH') as PaymentMethod,
    status: String(data.status ?? 'PENDING') as OrderStatus,
    createdAt: String(data.createdAt ?? data.orderDate ?? ''),
    logs: asArray(data.logs).map(normalizeOrderLog),
  };
}

const MOCK: AdminOrder[] = [
  {
    id: 'ORD-2845', customer: { name: 'Nguyễn Văn A', phone: '0901234567' },
    branch: 'Chi nhánh Q1',
    items: [{ product: 'Trà Sữa Trân Châu', size: 'L', quantity: 2, price: 45000 }, { product: 'Trà Đào Cam Sả', size: 'M', quantity: 1, price: 35000 }],
    total: 125000, paymentMethod: 'CASH', status: 'PAID', createdAt: '2026-04-28 09:15:00',
    logs: [{ action: 'Tạo đơn', time: '09:15', user: 'Thu ngân Q1' }, { action: 'Thanh toán tiền mặt', time: '09:16', user: 'Thu ngân Q1' }],
  },
  {
    id: 'ORD-2844', customer: { name: 'Trần Thị B', phone: '0912345678' },
    branch: 'Chi nhánh Q3',
    items: [{ product: 'Cà Phê Sữa Đá', size: 'L', quantity: 1, price: 42000 }, { product: 'Trà Oolong', size: 'M', quantity: 1, price: 28000 }],
    total: 95000, paymentMethod: 'VNPAY', status: 'PENDING', createdAt: '2026-04-28 09:30:00',
    logs: [{ action: 'Tạo đơn', time: '09:30', user: 'Thu ngân Q3' }],
  },
  {
    id: 'ORD-2843', customer: { name: 'Lê Văn C', phone: '0923456789' },
    branch: 'Chi nhánh Q7',
    items: [{ product: 'Combo 4 ly Trà Sữa', size: 'L', quantity: 1, price: 160000 }, { product: 'Topping Trân Châu', size: 'M', quantity: 4, price: 20000 }],
    total: 240000, paymentMethod: 'BANK_TRANSFER', status: 'COMPLETED', createdAt: '2026-04-28 08:45:00',
    logs: [{ action: 'Tạo đơn', time: '08:45', user: 'Thu ngân Q7' }, { action: 'Hoàn thành', time: '09:05', user: 'Pha chế Q7' }],
  },
];

interface ListResponse<T> { data: T[]; }

export const orderApiService = {
  async getAll(params?: { status?: string; search?: string }): Promise<AdminOrder[]> {
    if (!API_BASE) {
      let result = [...MOCK];
      if (params?.status && params.status !== 'ALL') result = result.filter((o) => o.status === params.status);
      if (params?.search) {
        const q = params.search.toLowerCase();
        result = result.filter((o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q));
      }
      return result;
    }
    const qs = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    const res = await api.get<ListResponse<AdminOrder> | AdminOrder[]>(`/api/orders${qs.toString() ? '?' + qs : ''}`);
    const rows = Array.isArray(res) ? res : res.data;
    return asArray(rows).map(normalizeOrder);
  },

  async getById(id: string): Promise<AdminOrder | undefined> {
    if (!API_BASE) return MOCK.find((o) => o.id === id);
    const res = await api.get<AdminOrder>(`/api/orders/${id}`);
    return normalizeOrder(res);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    if (!API_BASE) {
      const o = MOCK.find((o) => o.id === id);
      if (o) o.status = status;
      return;
    }
    await api.put(`/api/orders/${id}/status`, { status });
  },

  async payCash(orderId: string): Promise<void> {
    if (!API_BASE) {
      const o = MOCK.find((o) => o.id === orderId);
      if (o) o.status = 'PAID';
      return;
    }
    await api.post(`/api/payments/cash/${orderId}`);
  },

  async createVNPayUrl(orderId: string): Promise<string> {
    if (!API_BASE) return `https://vnpay.vn/mock?orderId=${orderId}`;
    const res = await api.post<{ url: string }>(`/api/payments/vnpay/create-url/${orderId}`);
    return res.url;
  },
};
