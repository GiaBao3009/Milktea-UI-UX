# Changelog – Missing Screens Implementation

## Tổng quan

Bổ sung các màn hình còn thiếu để coverage đầy đủ các API endpoint của hệ thống milktea POS/Admin.

---

## Màn hình mới

### 1. Thuộc tính sản phẩm — `/admin/attributes`
**File:** `src/app/admin/AttributesPage.tsx`

Quản lý các nhóm thuộc tính sản phẩm như Size, Đá, Đường, Topping.

**Tính năng:**
- Hiển thị danh sách nhóm dạng accordion card (expand/collapse)
- CRUD đầy đủ: tạo, chỉnh sửa, xoá nhóm
- Trong mỗi nhóm: thêm/xoá tuỳ chọn, đặt giá thêm, đánh dấu mặc định (⭐)
- Phân biệt kiểu chọn: **single** (chọn một – Size, Đá) vs **multiple** (chọn nhiều – Topping)
- Badge bắt buộc/tuỳ chọn, trạng thái active/inactive
- Scroll animation stagger trên mỗi card
- Modal tạo/sửa có scroll khi nội dung dài

**API coverage:**
```
GET    /api/attributes
POST   /api/attributes
GET    /api/attributes/{id}
PUT    /api/attributes/{id}
DELETE /api/attributes/{id}
```

---

### 2. Ca bán hàng — `/admin/shifts`
**File:** `src/app/admin/ShiftSessionsPage.tsx`

Quản lý ca bán hàng POS (mở ca đầu ngày, chốt ca cuối ngày).

**Tính năng:**
- Card ca đang mở nổi bật với **live pulse indicator** và **đồng hồ đếm thời gian** thực
- Hiển thị tổng kết ca: thời gian chạy, số đơn, tiền mở ca
- Modal mở ca: chọn chi nhánh, nhập tiền mặt đầu ca, ghi chú
- Modal đóng ca: tổng kết tự động + nhập tiền cuối ca, cảnh báo trước khi đóng
- Lịch sử ca có thể thu/mở (accordion), hiển thị đầy đủ thông tin
- Nút shortcut "Vào màn hình POS" từ ca đang mở

**API coverage:**
```
POST /api/shift-sessions/open
POST /api/shift-sessions/{id}/close
GET  /api/shift-sessions
GET  /api/shift-sessions/{id}
```

---

### 3. Màn hình POS — `/admin/pos`
**File:** `src/app/admin/POSPage.tsx`

Giao diện bán hàng full-screen dành cho cashier tại quầy, **không có admin sidebar**.

**Tính năng:**
- **Split layout:** trái = catalog sản phẩm (2/3), phải = giỏ đơn hàng (1/3)
- Tìm kiếm sản phẩm realtime
- Tab danh mục cuộn ngang
- Product card hover effect + quick add
- Modal chọn Size & ghi chú khi sản phẩm có nhiều kích cỡ
- Giỏ hàng: tăng/giảm số lượng, xoá món, xoá tất cả
- **Payment modal:** chọn Tiền mặt hoặc VNPay/QR
  - Tiền mặt: tính tiền thối tự động, preset nhanh (50k, 100k, 200k, 500k, đúng tiền)
  - VNPay: placeholder QR code
- **Success overlay** spring animation sau thanh toán
- **Responsive mobile:** tab toggle Products ↔ Order, badge đếm số món
- Live indicator ca đang mở

**API coverage:**
```
POST /api/orders   (với idempotency-key)
POST /api/payments/cash/{orderId}
POST /api/payments/vnpay/create-url/{orderId}
```

---

## Service files mới

### `src/modules/system/services/attributeService.ts`
CRUD cho `AttributeGroup` và `AttributeOption`. Mock data gồm 4 nhóm mặc định: Size, Đá, Đường, Topping.

### `src/modules/system/services/shiftSessionService.ts`
Mở/đóng ca, lấy danh sách theo status. Dùng `extractRows` để tương thích với mọi format API response.

---

## Files đã sửa

| File | Thay đổi |
|------|----------|
| `src/app/routes.tsx` | Thêm 3 route: `/admin/attributes`, `/admin/shifts`, `/admin/pos`. POS chạy ngoài `AdminLayout` (full-screen) |
| `src/app/layouts/AdminLayout.tsx` | Thêm 3 nav item: Ca bán hàng, Màn hình POS, Thuộc tính SP |
| `src/assets/i18n/vi.json` | Thêm keys: `shifts`, `pos`, `attributes` |
| `src/assets/i18n/en.json` | Thêm keys: `shifts`, `pos`, `attributes` |

---

## Bug fix

**Lỗi:** `TypeError: Cannot read properties of undefined (reading 'filter')` tại `ShiftSessionsPage`

**Nguyên nhân:** Khi `VITE_API_URL` được set, `api.get()` auto-unwrap `CustomResponseDto.data` thành array. Service gọi thêm `.data` một lần nữa → trả về `undefined` → `setSessions(undefined)` → crash.

**Fix:**
1. `shiftSessionService.getAll`: dùng `extractRows<ShiftSession>(data)` thay vì `res.data`
2. Component: `(sessions ?? []).filter(...)` làm defensive fallback

---

## Design principles

- **Icons:** toàn bộ dùng `lucide-react`
- **Animation:** `motion/react` — stagger card, spring modal, viewport scroll trigger
- **Responsive:** mobile-first với Tailwind breakpoints `md:`, `lg:`, `xl:`
- **Colors:** `#00495a` (primary teal), `#fb6514` (accent orange) — nhất quán toàn app
- **Dark mode:** tương thích qua Tailwind `dark:` classes
