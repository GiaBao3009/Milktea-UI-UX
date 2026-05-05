# Menu Review

## 2026-04-28

### Changed
- `src/app/pages/MenuPage.tsx`
- Mobile menu now uses staff/POS order rows: image, product name, price, minus button, quantity, plus button.
- Desktop menu grid is preserved for the current POS desktop view.
- Mobile plus/minus updates the cart directly with default options: size `M`, sweetness `50%`.

### Check
- Open `/thuc-don` on mobile width.
- Each product row should read left to right: image -> name/price -> `- quantity +`.
- Tapping `+` should increase the quantity and show/update the floating cart bar.
- Tapping `-` should decrease quantity and remove the item at zero.
- Open `/thuc-don` on desktop width to confirm the existing card grid is still shown.

### Verification
- `npm run build` passed.
- Vite still warns that the main JS chunk is larger than 500 kB; this is an existing bundle-size warning, not a compile error from this change.

## 2026-04-28 - Staff Mobile Order Polish

### Changed
- `src/app/pages/MenuPage.tsx`
- Added extra mobile bottom padding to the product list so the last item can scroll above the orange cart bar.
- Moved the mobile cart bar down to the bottom because the bottom nav is hidden on the order screen.
- Added a staff mobile top bar with a back button and hamburger entry point.
- Added a left drawer menu for staff navigation: home, current order, cart, order history, logout.
- `src/app/components/MobileBottomNav.tsx`
- Hid the bottom nav on `/thuc-don` so staff have more room for ordering.
- `src/app/routes.tsx`
- Removed the layout bottom padding on `/thuc-don` because the bottom nav is no longer shown there.
- `src/app/context/CartContext.tsx`
- Persisted cart items to `localStorage` so the current order survives route changes and page reloads.
- `src/styles/index.css`
- Added `overscroll-behavior-x: none` to reduce accidental browser back gestures.

### Check
- Open `/thuc-don` on mobile width.
- Scroll to the final product and confirm it sits above the orange cart bar.
- Confirm bottom nav is gone on `/thuc-don`, but still appears on normal customer pages.
- Tap the hamburger icon and confirm the drawer slides in from the left.
- Add products, refresh the page, and confirm the quantities remain.

### Verification
- `npm run build` passed after the final label cleanup.
- The first sandboxed build attempt hit `spawn EPERM` from esbuild; rerunning with approval passed.
- Vite still warns that the main JS chunk is larger than 500 kB.

---

## 2026-04-28 – Navbar Logo Centered (Absolute Positioning)

### Vấn đề
Logo nằm bên trái do `justify-content: space-between`. Cụm action buttons bên phải (Đăng nhập + Cart + User) rộng hơn nút Back bên trái, khiến logo bị lệch khỏi tâm thị giác.

### Changed
- `src/app/components/Navbar.tsx`
  - Thêm `position: relative` vào container navbar (`<div className="relative mx-auto ...">`).
  - Chuyển logo `<Link>` sang dùng `position: absolute; left: 50%; transform: translateX(-50%)` (Tailwind: `absolute left-1/2 -translate-x-1/2`).
  - Tái cấu trúc layout thành **3 cột rõ ràng**:
    - **Cột trái**: Nav links (Trang chủ, Thực đơn, Hội viên, Ưu đãi, Về chúng tôi)
    - **Cột giữa (tuyệt đối)**: Logo + tên thương hiệu — luôn nằm đúng tâm màn hình
    - **Cột phải**: Đăng nhập, Cart, User icon, Hamburger (mobile)
  - Dropdown "Về chúng tôi" chuyển từ `right-0` sang `left-0` để căn theo cột trái.
  - Cột phải thêm `ml-auto` để đẩy sát về phải, không ảnh hưởng vị trí logo.

### Check
- Mở trang bất kỳ trên desktop (`≥ 768px`).
- Logo "Fresh Bubble Tea" phải nằm chính giữa thanh navbar, cân đối 2 bên.
- Hover vào logo → scale animation vẫn hoạt động.
- Click logo → điều hướng về `/`.
- Dropdown "Về chúng tôi" mở ra phía bên trái của nút, không tràn ra rìa màn hình.
- Trên mobile, layout không thay đổi (desktop navbar ẩn trên `md:`).

### Verification
- Không có build errors hay TypeScript lỗi.
- Kỹ thuật `absolute + left-1/2 + -translate-x-1/2` là chuẩn CSS, không phụ thuộc vào chiều rộng 2 cột bên.
- Desktop Navbar đã được revert về layout gốc (logo trái) — chỉ mobile top bar trong MenuPage được sửa.

---

## 2026-04-28 – Mobile Top Bar Logo Centered (MenuPage)

### Vấn đề
Logo bị lệch phải trên mobile top bar của `/thuc-don` vì `justify-content: space-between` và cụm 2 nút bên phải (Menu + User) rộng hơn nút Back bên trái.

### Changed
- `src/app/pages/MenuPage.tsx`
  - Thêm `relative` vào `<div className="flex items-center justify-between">`.
  - Logo `<img>` chuyển sang `absolute left-1/2 -translate-x-1/2`.
  - Logo luôn nằm đúng tâm thanh top bar mobile, mặc kệ kích thước 2 bên.

### Check
- Mở `/thuc-don` trên mobile.
- Logo phải nằm chính giữa top bar, cân đối với nút Back và cụm Menu+User.
- Desktop không bị ảnh hưởng (top bar `md:hidden`).

---

## 2026-04-28 – Admin Panel Setup

### Changed
- **Tạo mới** `src/app/context/AuthContext.tsx`
  - Quản lý JWT session admin.
  - Login: gọi `POST /api/auth/login` → fallback mock nếu network lỗi.
  - Credentials mặc định: **admin / 123456** (hoặc admin@chips.vn / 123456).
  - Lưu session vào `localStorage` key `chips_admin_user`.
  - Expose: `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`.

- **Tạo mới** `src/app/context/UserAuthContext.tsx`
  - Stub context cho customer auth — tách biệt khỏi admin.

- **Tạo mới** `src/app/admin/AdminLayout.tsx`
  - Sidebar dark (`#12151c`) với 3 nhóm nav: Tổng quan / Vận hành / Quản lý.
  - Mobile overlay sidebar với AnimatePresence.
  - Top bar breadcrumb + avatar.
  - Logout gọi `AuthContext.logout()`.

- **Tạo mới** `src/app/admin/AdminGuard.tsx`
  - Route guard: redirect `/admin/login` nếu `isAuthenticated === false`.

- **Cập nhật** `src/app/routes.tsx`
  - Bọc `RootLayout` trong `<AuthProvider>`.
  - Đăng ký `/admin/login` → `<Auth />`.
  - Đăng ký `/admin/*` → `AdminGuard` → `AdminLayout` → các trang.

### Routes admin đã đăng ký
| Path | Component |
|---|---|
| `/admin/login` | Auth (login form) |
| `/admin` | Dashboard |
| `/admin/orders` | OrderManagement |
| `/admin/products` | MenuManagement |
| `/admin/customers` | CustomerManagement |
| `/admin/vouchers` | VoucherManagement |
| `/admin/analytics` | Reports |
| `/admin/branches` | BranchManagement |
| `/admin/staff` | StaffManagement |
| `/admin/audit` | AuditLog |

### Check
- Truy cập `/admin` khi chưa đăng nhập → redirect `/admin/login`.
- Đăng nhập bằng `admin / 123456` → redirect `/admin` (Dashboard).
- Sidebar navigation hoạt động giữa các trang.
- Logout → redirect `/admin/login`, xóa session.

---

## 2026-04-28 – Fix Missing Admin Dependencies

### Vấn đề
Các admin pages import nhiều file chưa tồn tại trong project, gây lỗi Vite import-analysis khi khởi động dev server:
- `../utils/toast` 
- `../services/OrderService`
- `../hooks/useDataFetching`
- `../components/ui/EmptyState`
- `../components/Logo`
- `../../data/mockData`

### Changed
- **Tạo mới** `src/app/utils/toast.ts` — wrapper `showToast.*` dùng `sonner`.
- **Tạo mới** `src/app/components/ui/EmptyState.tsx` — component hiển thị trạng thái rỗng.
- **Tạo mới** `src/app/components/Logo.tsx` — render logo image.
- **Tạo mới** `src/app/hooks/useDataFetching.ts` — `usePagination` + `useInfiniteScroll`.
- **Tạo mới** `src/app/services/OrderService.ts` — CRUD đơn hàng qua `localStorage`, mock data 5 đơn mẫu.
- **Tạo mới** `src/data/mockData.ts` — mock data cho products, toppings, customers, vouchers, branches, staff, orders, reviews.

### Check
- Dev server (`npm run dev`) khởi động không có lỗi import.
- Trang `/admin/orders` render danh sách đơn từ `OrderService.getAllOrders()`.
- Trang `/admin/products` render grid sản phẩm từ `mockData.products`.

### Verification
- Tất cả imports đã được resolve.
- Không có TypeScript errors mới phát sinh.

---

## 2026-04-28 – Admin UI Redesign + API Integration

### Changed

#### Admin Layout (`src/app/layouts/AdminLayout.tsx`)
- Chuyển sidebar & header từ **dark theme** (`#12151c`) sang **light theme** (trắng, viền `border-slate-100`).
- Thêm **hamburger button** trên desktop để collapse/expand sidebar (64px ↔ 220px) với animation spring.
- Collapsed mode: chỉ hiện icon, hover hiện tooltip tên mục.
- Mobile vẫn dùng overlay như cũ.
- Nav groups cập nhật: Dashboard / Vận hành (Đơn hàng, Sản phẩm) / Quản lý (Chi nhánh) / Hệ thống (Nhân viên, Phân quyền).

#### Routes (`src/app/routes.tsx`)
- Thay thế toàn bộ module pages cũ bằng các trang mới từ `src/app/admin/`.
- `/admin/login` dùng lại `LoginPage` từ `@app/pages/LoginPage` (xóa file thừa).
- Thêm routes mới: `/admin/roles`, `/admin/account`.

#### Infrastructure

| File | Mô tả |
|------|-------|
| `src/shared/services/api.ts` | Base HTTP client: tự đọc JWT token từ localStorage, attach `Authorization` header |
| `src/modules/system/services/branchService.ts` | CRUD `/api/branches` |
| `src/modules/system/services/reportService.ts` | GET `/api/reports/revenue-overview`, `/revenue-by-day`, `/top-products` |
| `src/modules/order/services/orderApiService.ts` | GET/PUT `/api/orders`, POST `/api/payments/cash`, `/api/payments/vnpay/create-url` |
| `src/modules/product-catalog/services/productService.ts` | CRUD `/api/products` + `/api/product-categories` |
| `src/modules/account/services/userService.ts` | CRUD `/api/account/users` |
| `src/modules/account/services/accountService.ts` | POST `/api/account/change-password` |
| `src/modules/permission/services/roleService.ts` | GET/PUT `/api/roles` + `/api/screens` |
| `src/modules/permission/index.ts` | Export module mới |

> **Pattern fallback**: Khi `VITE_API_URL` chưa được set → dùng mock data inline. Khi set URL → gọi API thật.

#### Admin Pages (`src/app/admin/`)

| Page | Thay đổi |
|------|---------|
| `DashboardPage.tsx` | Fetch real data: overview stats, biểu đồ doanh thu theo ngày, top products, recent orders |
| `OrdersPage.tsx` | Fetch orders với filter/search, update status, VNPay URL, cash payment, loading states |
| `ProductsPage.tsx` | CRUD đầy đủ sản phẩm + danh mục, modal thêm/sửa, quản lý size/giá |
| `ReportsPage.tsx` | Fetch overview + bar chart doanh thu & lợi nhuận + top products từ API |
| `BranchesPage.tsx` | CRUD đầy đủ: modal thêm/sửa, xác nhận xóa, loading state, empty state |
| `UsersPage.tsx` | Fetch nhân viên, modal thêm/sửa, search |
| `RolesPage.tsx` | Fetch roles + screens, ma trận phân quyền có thể toggle checkbox |
| `AccountPage.tsx` | Đổi mật khẩu gọi real API, validate confirm password |

#### Config
- Tạo `tsconfig.json` + `tsconfig.node.json` để IDE nhận diện path aliases (`@app`, `@modules`, `@shared`).

### Check
- Truy cập `/admin` → Dashboard load với spinner, sau đó hiển thị stats thật.
- Vào **Chi nhánh**: thêm / sửa / xóa chi nhánh.
- Vào **Đơn hàng**: filter theo trạng thái, click eye icon xem chi tiết, cập nhật status.
- Vào **Sản phẩm**: thêm sản phẩm mới với nhiều size, chuyển tab sang Danh mục.
- Sidebar: click hamburger → collapse còn icon, hover icon → tooltip tên mục.
- Click hamburger lần nữa → expand trở lại.



---

## 2026-04-29 – Dynamic Attributes + Conditional Order Flow

### Vấn đề
BE thêm attributes (đường, đá, topping, kích cỡ) do admin quản lý động. Frontend đang hardcode `SIZES` và `SWEETNESS_LEVELS`. Cần:
1. Nguồn dữ liệu attributes chung giữa admin panel và customer-facing pages.
2. Nếu admin xoá hết attributes → không hiện popup/navigate khi đặt món (thêm thẳng vào giỏ).
3. Nếu có ≥1 attributes → desktop mở modal, mobile navigate sang trang chọn options.
4. Một số sản phẩm (Nước Ngọt đóng chai) không có attributes → luôn thêm thẳng, bất kể admin cấu hình gì.

### Changed

#### `src/app/context/AttributesContext.tsx` *(tạo mới)*
- Context `AttributesProvider` + hook `useAttributes()` cho toàn app.
- `ProductAttribute`: `{ id, name, options: AttributeOption[], required, multiSelect? }`.
- `AttributeOption`: `{ id, label, priceAdd? }`.
- Default attributes: **Kích cỡ** (S/M/L), **Mức đường** (0–100%), **Mức đá** (4 mức), **Topping** (`multiSelect: true`, 6 options).
- `getDefaultSelections(attrs)` chỉ trả về defaults cho single-select attrs; multi-select luôn bắt đầu rỗng `[]`.
- CRUD: `addAttribute`, `removeAttribute`, `updateAttribute`.

#### `src/app/App.tsx`
- Bọc `<RouterProvider>` trong `<AttributesProvider>` → context available cả customer lẫn admin routes.

#### `src/app/data/products.ts`
- Thêm field `skipAttributes?: boolean` vào interface `Product`.
- Thêm category `drinks` vào `CATEGORIES`.
- Thêm 3 sản phẩm test `skipAttributes: true`: **Pepsi Lon 330ml**, **7UP Lon 330ml**, **Nước Suối Dasani 500ml**.

#### `src/app/pages/MenuPage.tsx`
- Import `useAttributes`, lấy `hasAttributes`.
- Hàm `needsSelection(product)` = `hasAttributes && !product.skipAttributes`.
- `handleDirectAdd(product)` — thêm thẳng vào giỏ không qua popup/navigate.
- `handleQuickAdd` dùng `needsSelection`:
  - Mobile: navigate `/thuc-don/:id` nếu cần chọn, ngược lại `handleDirectAdd`.
  - Desktop: mở `ProductModal` nếu cần chọn, ngược lại `handleDirectAdd`.
- Mobile list item `+` button:
  - `needsSelection` → nút `+` đơn navigate sang trang chọn options.
  - `!needsSelection` → giữ nguyên cụm `−/count/+` cộng trừ nhanh.
- Desktop card `onClick` dùng cùng logic `needsSelection`.

#### `src/app/pages/ProductDetailPage.tsx` *(rewrite)*
- **`OptionRow` component** — unified tappable row cho cả single-select và multi-select:
  ```
  [ Tên Option .............. (✓) ]  ← selected: vòng tròn cam + Check icon
  [ Tên Option .............. ( ) ]  ← not selected: vòng tròn xám trống
  ```
  Không có radio circle hay checkbox vuông. Visual 100% đồng bộ.
- State: `selections: Record<string, string>` (single) + `multiSelections: Record<string, string[]>` (multi).
- Logic bên dưới phân nhánh tại `onClick`:
  - Single-select → `setSelections` (replace).
  - Multi-select → `toggleMultiSelection` (push/filter).
- Mobile: **tất cả attributes** (kể cả toppings) dùng `OptionRow` — uniform 100%.
- Desktop: single-select dùng compact tile buttons; multi-select (toppings) dùng 2-column grid `OptionRow`.
- Price tính gộp single-select priceAdd + multi-select priceAdds.
- Cart item: `toppings` field nhận mảng tên topping đã chọn.
- `skipAttributes`: không render section attributes, hiển thị note "Sản phẩm đóng gói sẵn".

#### `src/app/components/ProductModal.tsx` *(rewrite)*
- Thêm `multiSelections: Record<string, string[]>` state.
- `useEffect` init multi-select thành `{}` mỗi lần mở modal.
- Price tính gộp priceAdd của cả single + multi.
- Toppings multi-select: compact button tiles, click toggle, hiển thị `Check` icon nhỏ khi selected, multiple có thể active cùng lúc.
- `cartId` encode cả single và multi selections.

#### `src/modules/product-catalog/pages/MenuManagement.tsx`
- Import `useAttributes` — tab **Thuộc tính** giờ kết nối thật với context.
- Mỗi attribute hiển thị tên + số lựa chọn + nút xoá attribute.
- Mỗi option là chip có nút `×` để xoá inline.
- Input inline cuối mỗi attribute để thêm lựa chọn mới (Enter hoặc nút `+`).
- Nút dashed "Thêm thuộc tính mới" ở cuối, click mở form inline.
- Empty state khi không còn attribute nào (nhắc nhở nhân viên thêm lại).

### Check
- Mở `/thuc-don` mobile → tap `+` trà sữa → navigate sang trang chọn size/đường/đá/topping.
- Tap `+` Pepsi Lon → thêm thẳng vào giỏ, không navigate.
- Desktop → click card trà sữa → modal mở với size, đường, đá, topping.
- Chọn nhiều topping trên mobile → OptionRow đồng bộ visual (✓) cho cả toppings lẫn size.
- Desktop modal → click nhiều topping, tất cả highlight cùng lúc.
- Vào `/admin/products` → tab Thuộc tính → xoá attribute "Mức đá".
- Quay lại `/thuc-don` → modal không còn mục Mức đá.
- Xoá hết attributes → tap `+` bất kỳ → thêm thẳng, không popup/navigate.

### Verification
- Không có TypeScript errors mới từ thay đổi này.
- `AttributesProvider` wraps toàn bộ router tree → không cần thêm vào từng layout riêng.
