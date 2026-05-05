import { orders as mockOrders } from '@app/constants/mockData';

type Order = (typeof mockOrders)[number];

let _orders: Order[] = [...mockOrders];

export const OrderService = {
  getAllOrders(): Order[] {
    return _orders;
  },

  updateOrderStatus(id: string, status: Order['status']): { success: boolean; error?: string } {
    const idx = _orders.findIndex((o) => o.id === id);
    if (idx === -1) return { success: false, error: 'Không tìm thấy đơn hàng' };
    _orders = _orders.map((o) => (o.id === id ? { ...o, status } : o));
    return { success: true };
  },
};
