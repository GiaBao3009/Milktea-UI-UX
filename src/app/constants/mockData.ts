/**
 * mockData – dữ liệu mẫu cho admin pages.
 * Sau khi kết nối API thật, import sẽ được thay bằng API calls.
 */

// ─── Products ────────────────────────────────────────────────────────────────
export const products = [
  { id: 'p1', name: 'Trà Sữa Trân Châu Đường Đen', category: 'Trà Sữa', price: 65000, salePrice: null, status: 'active', badge: 'Bán chạy', rating: 4.9, sold: 842, image: 'https://images.unsplash.com/photo-1529474944862-bf4949bd2f1a?w=400&q=80' },
  { id: 'p2', name: 'Trà Sữa Oolong Rang', category: 'Trà Sữa', price: 69000, salePrice: null, status: 'active', badge: null, rating: 4.8, sold: 621, image: 'https://images.unsplash.com/photo-1552014631-125e3a6b9594?w=400&q=80' },
  { id: 'p3', name: 'Matcha Kem Sữa Trân Châu', category: 'Trà Sữa', price: 72000, salePrice: 62000, status: 'active', badge: 'Mới', rating: 4.8, sold: 512, image: 'https://images.unsplash.com/photo-1592284441621-581ebd2e677d?w=400&q=80' },
  { id: 'p4', name: 'Trà Xanh Sữa Chua Nha Đam', category: 'Trà Trái Cây', price: 62000, salePrice: null, status: 'active', badge: null, rating: 4.6, sold: 380, image: 'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?w=400&q=80' },
  { id: 'p5', name: 'Trà Đào Oolong', category: 'Trà Trái Cây', price: 58000, salePrice: null, status: 'active', badge: 'Bán chạy', rating: 4.7, sold: 715, image: 'https://images.unsplash.com/photo-1647211429169-624da11ce47d?w=400&q=80' },
  { id: 'p6', name: 'Trà Nhài Xoài Tươi', category: 'Trà Trái Cây', price: 60000, salePrice: null, status: 'active', badge: 'Mới', rating: 4.7, sold: 290, image: 'https://images.unsplash.com/photo-1771405317905-44d78aa82d3e?w=400&q=80' },
  { id: 'p7', name: 'Oolong Kem Phô Mai', category: 'Trà Sữa', price: 68000, salePrice: null, status: 'active', badge: null, rating: 4.8, sold: 540, image: 'https://images.unsplash.com/photo-1501841580093-a258b1937efe?w=400&q=80' },
  { id: 'p8', name: 'Trà Sữa Khoai Môn Dừa', category: 'Trà Sữa', price: 71000, salePrice: null, status: 'inactive', badge: 'Sale', rating: 4.9, sold: 210, image: 'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?w=400&q=80' },
];

// ─── Toppings ─────────────────────────────────────────────────────────────────
export const toppings = [
  { id: 't1', name: 'Trân Châu Đen', category: 'Trân Châu', price: 10000, status: 'active' },
  { id: 't2', name: 'Trân Châu Trắng', category: 'Trân Châu', price: 10000, status: 'active' },
  { id: 't3', name: 'Thạch Đào', category: 'Thạch', price: 8000, status: 'active' },
  { id: 't4', name: 'Thạch Cà Phê', category: 'Thạch', price: 8000, status: 'active' },
  { id: 't5', name: 'Kem Phô Mai', category: 'Kem', price: 12000, status: 'active' },
  { id: 't6', name: 'Pudding Trứng', category: 'Pudding', price: 10000, status: 'inactive' },
  { id: 't7', name: 'Đậu Đỏ', category: 'Đậu', price: 7000, status: 'active' },
];

// ─── Customers ────────────────────────────────────────────────────────────────
export const customers = [
  { id: 'c1', name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901234567', orders: 12, totalSpent: 780000, tier: 'Gold', joinDate: '01/02/2026', status: 'active' },
  { id: 'c2', name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', orders: 5, totalSpent: 310000, tier: 'Silver', joinDate: '15/03/2026', status: 'active' },
  { id: 'c3', name: 'Lê Văn C', email: 'c@gmail.com', phone: '0923456789', orders: 28, totalSpent: 1920000, tier: 'Platinum', joinDate: '10/01/2026', status: 'active' },
  { id: 'c4', name: 'Phạm Thị D', email: 'd@gmail.com', phone: '0934567890', orders: 2, totalSpent: 140000, tier: 'Bronze', joinDate: '20/04/2026', status: 'inactive' },
  { id: 'c5', name: 'Hoàng Văn E', email: 'e@gmail.com', phone: '0945678901', orders: 9, totalSpent: 620000, tier: 'Silver', joinDate: '05/02/2026', status: 'active' },
];

// ─── Vouchers ─────────────────────────────────────────────────────────────────
export const vouchers = [
  { id: 'v1', code: 'WELCOME10', type: 'percent', value: 10, minOrder: 50000, maxDiscount: 20000, used: 142, limit: 500, startDate: '01/04/2026', endDate: '30/04/2026', status: 'active' },
  { id: 'v2', code: 'SAVE20K', type: 'fixed', value: 20000, minOrder: 80000, maxDiscount: 20000, used: 89, limit: 200, startDate: '15/04/2026', endDate: '15/05/2026', status: 'active' },
  { id: 'v3', code: 'SUMMER15', type: 'percent', value: 15, minOrder: 100000, maxDiscount: 30000, used: 200, limit: 200, startDate: '01/03/2026', endDate: '01/04/2026', status: 'expired' },
];

// ─── Branches ─────────────────────────────────────────────────────────────────
export const branches = [
  { id: 'b1', name: 'Fresh Bubble Tea Q1', address: '123 Lê Lợi, Q1, TP.HCM', phone: '028 1234 5678', manager: 'Nguyễn Thị Lan', openTime: '07:00', closeTime: '22:00', status: 'active', dailyOrders: 240 },
  { id: 'b2', name: 'Fresh Bubble Tea Q3', address: '456 Võ Văn Tần, Q3, TP.HCM', phone: '028 2345 6789', manager: 'Trần Văn Minh', openTime: '07:30', closeTime: '22:00', status: 'active', dailyOrders: 185 },
  { id: 'b3', name: 'Fresh Bubble Tea Q7', address: '789 Nguyễn Hữu Thọ, Q7, TP.HCM', phone: '028 3456 7890', manager: 'Lê Thị Hoa', openTime: '08:00', closeTime: '21:30', status: 'active', dailyOrders: 162 },
  { id: 'b4', name: 'Fresh Bubble Tea Bình Thạnh', address: '321 Đinh Tiên Hoàng, Bình Thạnh', phone: '028 4567 8901', manager: 'Phạm Văn Đức', openTime: '07:00', closeTime: '22:30', status: 'inactive', dailyOrders: 0 },
];

// ─── Staff ────────────────────────────────────────────────────────────────────
export const staff = [
  { id: 's1', name: 'Nguyễn Thị Lan', email: 'lan@chips.vn', phone: '0901111111', role: 'manager', branch: 'Chi nhánh Q1', joinDate: '01/01/2026', status: 'active', avatar: null },
  { id: 's2', name: 'Trần Văn Minh', email: 'minh@chips.vn', phone: '0902222222', role: 'manager', branch: 'Chi nhánh Q3', joinDate: '15/01/2026', status: 'active', avatar: null },
  { id: 's3', name: 'Lê Thị Hoa', email: 'hoa@chips.vn', phone: '0903333333', role: 'cashier', branch: 'Chi nhánh Q1', joinDate: '01/02/2026', status: 'active', avatar: null },
  { id: 's4', name: 'Phạm Văn Đức', email: 'duc@chips.vn', phone: '0904444444', role: 'staff', branch: 'Chi nhánh Q7', joinDate: '10/02/2026', status: 'inactive', avatar: null },
];

// ─── Orders (for OrderManagement) ────────────────────────────────────────────
export const orders = [
  { id: 'CHIPS-1001', customer: 'Nguyễn Văn A', phone: '0901234567', branch: 'Chi nhánh Q1', time: '09:15', date: '28/04/2026', items: [{ productName: 'Trà Sữa Trân Châu', quantity: 2, price: 65000 }], total: 130000, status: 'pending' as const, payment: 'Tiền mặt', customerType: 'member' as const },
  { id: 'CHIPS-1002', customer: 'Trần Thị B', phone: '0912345678', branch: 'Chi nhánh Q3', time: '09:40', date: '28/04/2026', items: [{ productName: 'Matcha Kem Sữa', quantity: 1, price: 72000 }], total: 72000, status: 'confirmed' as const, payment: 'VNPay', customerType: 'guest' as const },
  { id: 'CHIPS-1003', customer: 'Lê Văn C', phone: '0923456789', branch: 'Chi nhánh Q7', time: '10:05', date: '28/04/2026', items: [{ productName: 'Trà Đào Oolong', quantity: 3, price: 58000 }], total: 174000, status: 'completed' as const, payment: 'Thẻ ngân hàng', customerType: 'member' as const },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviews = [
  { id: 'r1', customer: 'Nguyễn Văn A', product: 'Trà Sữa Trân Châu', rating: 5, comment: 'Ngon lắm, sẽ quay lại!', date: '25/04/2026', status: 'published', branch: 'Chi nhánh Q1' },
  { id: 'r2', customer: 'Trần Thị B', product: 'Matcha Kem Sữa', rating: 4, comment: 'Vị matcha đậm, nhưng hơi ngọt.', date: '26/04/2026', status: 'published', branch: 'Chi nhánh Q3' },
  { id: 'r3', customer: 'Lê Văn C', product: 'Trà Đào Oolong', rating: 2, comment: 'Đợi quá lâu, phục vụ kém.', date: '27/04/2026', status: 'pending', branch: 'Chi nhánh Q7' },
];
