import { api } from "@app/services/api";
import type { SocketResponse } from "@app/types/types";

// Đổi thành false khi backend permission API đã sẵn sàng
const USE_MOCK: boolean = true;
const isMock = (): boolean => USE_MOCK;
import type {
  Role,
  Screen,
  GetRolesParams,
  CreateRoleDto,
  UpdateRoleDto,
  GetScreensParams,
  AssignRoleToUserDto,
  RemoveRoleFromUserDto,
} from "../types";

const MOCK_SCREENS: Screen[] = [
  { id: 1,  screenCode: 'DASHBOARD',           name: 'Tổng quan' },
  { id: 2,  screenCode: 'ORDER_MANAGEMENT',     name: 'Quản lý đơn hàng' },
  { id: 3,  screenCode: 'PRODUCT_MANAGEMENT',   name: 'Quản lý thực đơn' },
  { id: 4,  screenCode: 'STAFF_MANAGEMENT',     name: 'Quản lý nhân viên' },
  { id: 5,  screenCode: 'BRANCH_MANAGEMENT',    name: 'Quản lý chi nhánh' },
  { id: 6,  screenCode: 'SHIFT_MANAGEMENT',     name: 'Quản lý ca làm việc' },
  { id: 7,  screenCode: 'ANALYTICS',            name: 'Báo cáo thống kê' },
  { id: 8,  screenCode: 'VOUCHER_MANAGEMENT',   name: 'Quản lý ưu đãi' },
  { id: 9,  screenCode: 'ATTRIBUTE_MANAGEMENT', name: 'Thuộc tính sản phẩm' },
  { id: 10, screenCode: 'ROLE_SETTING',         name: 'Phân quyền hệ thống' },
  { id: 11, screenCode: 'SYSTEM_SETTINGS',      name: 'Cài đặt hệ thống' },
  { id: 12, screenCode: 'POS',                  name: 'Điểm bán hàng (POS)' },
];

// Permissions per role: Admin = toàn quyền, Manager = vận hành, Cashier = POS + đơn, Staff = chỉ xem
const ALL_ON  = { canView: true,  canCreate: true,  canEdit: true,  canDelete: true  };
const VIEW_EDIT= { canView: true, canCreate: true,  canEdit: true,  canDelete: false };
const VIEW_ONLY= { canView: true, canCreate: false, canEdit: false, canDelete: false };
const OFF      = { canView: false,canCreate: false, canEdit: false, canDelete: false };

const MOCK_PERMISSIONS: Record<number, Array<{ screenCode: string; screenId: number; screenName: string } & typeof ALL_ON>> = {
  1: MOCK_SCREENS.map(s => ({ screenId: s.id, screenCode: s.screenCode, screenName: s.name, ...ALL_ON })),
  2: MOCK_SCREENS.map(s => ({
    screenId: s.id, screenCode: s.screenCode, screenName: s.name,
    ...(['DASHBOARD','ORDER_MANAGEMENT','PRODUCT_MANAGEMENT','SHIFT_MANAGEMENT','ANALYTICS','POS'].includes(s.screenCode) ? VIEW_EDIT : VIEW_ONLY),
  })),
  3: MOCK_SCREENS.map(s => ({
    screenId: s.id, screenCode: s.screenCode, screenName: s.name,
    ...(['POS','ORDER_MANAGEMENT','DASHBOARD'].includes(s.screenCode) ? VIEW_EDIT : OFF),
  })),
  4: MOCK_SCREENS.map(s => ({
    screenId: s.id, screenCode: s.screenCode, screenName: s.name,
    ...(['POS','DASHBOARD'].includes(s.screenCode) ? VIEW_ONLY : OFF),
  })),
};

// User assignments per role (userId → roleIds)
export const MOCK_USER_GROUPS: Record<string, string[]> = {
  '1': ['1'],        // Nguyễn Thị Lan → Admin
  '2': ['1', '2'],   // Trần Văn Minh  → Admin + Manager
  '3': ['2'],        // Lê Thị Hoa     → Manager
  '4': ['3'],        // Phạm Văn Nam   → Cashier
  '5': ['3', '4'],   // Hoàng Thị Mai  → Cashier + Staff
};

const MOCK_ROLES: Role[] = [
  { id: 1, roleCode: 'ADMIN',   name: 'Quản trị viên',     permissions: MOCK_PERMISSIONS[1] },
  { id: 2, roleCode: 'MANAGER', name: 'Quản lý chi nhánh', permissions: MOCK_PERMISSIONS[2] },
  { id: 3, roleCode: 'CASHIER', name: 'Thu ngân',           permissions: MOCK_PERMISSIONS[3] },
  { id: 4, roleCode: 'STAFF',   name: 'Nhân viên',          permissions: MOCK_PERMISSIONS[4] },
];

function ok<T>(data: T): SocketResponse<T> {
  return { res_code: 0, data };
}

export const getRolesApi = (
  _params: GetRolesParams,
  callback: (response: SocketResponse<Role[]>) => void,
) => {
  if (isMock()) { callback(ok(MOCK_ROLES)); return; }
  api.get<Role[]>('/api/roles')
    .then((data) => callback(ok(Array.isArray(data) ? data : MOCK_ROLES)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const getRoleByIdApi = (
  id: number,
  callback: (response: SocketResponse<Role>) => void,
) => {
  if (isMock()) {
    const role = MOCK_ROLES.find((r) => r.id === id);
    callback(role ? ok(role) : { res_code: 1, error_cont: 'Không tìm thấy nhóm quyền' });
    return;
  }
  api.get<Role>(`/api/roles/${id}`)
    .then((data) => callback(ok(data)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const getRolesForUserApi = (
  userId: string | number,
  callback: (response: SocketResponse<Role[]>) => void,
) => {
  if (isMock()) { callback(ok([])); return; }
  api.get<Role[]>(`/api/roles/user/${userId}`)
    .then((data) => callback(ok(Array.isArray(data) ? data : [])))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const createRoleApi = (
  params: CreateRoleDto,
  callback: (response: SocketResponse<Role>) => void,
) => {
  if (isMock()) {
    const newRole: Role = { id: Date.now(), roleCode: params.roleCode, name: params.name, description: params.description };
    MOCK_ROLES.push(newRole);
    callback(ok(newRole));
    return;
  }
  api.post<Role>('/api/roles', params)
    .then((data) => callback(ok(data)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const updateRoleApi = (
  params: UpdateRoleDto,
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) {
    const i = MOCK_ROLES.findIndex((r) => r.id === params.id);
    if (i !== -1) Object.assign(MOCK_ROLES[i], params.data);
    callback(ok(undefined));
    return;
  }
  api.put(`/api/roles/${params.id}`, params.data)
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const deleteRoleApi = (
  id: number,
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) {
    const i = MOCK_ROLES.findIndex((r) => r.id === id);
    if (i !== -1) MOCK_ROLES.splice(i, 1);
    callback(ok(undefined));
    return;
  }
  api.delete(`/api/roles/${id}`)
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const assignRoleToUserApi = (
  params: AssignRoleToUserDto,
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) { callback(ok(undefined)); return; }
  api.post(`/api/roles/${params.roleId}/assign`, { userIds: params.userIds })
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const removeRoleFromUserApi = (
  params: RemoveRoleFromUserDto,
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) { callback(ok(undefined)); return; }
  api.post(`/api/roles/${params.roleId}/remove`, { userIds: params.userIds })
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const getScreensApi = (
  _params: GetScreensParams,
  callback: (response: SocketResponse<Screen[]>) => void,
) => {
  if (isMock()) { callback(ok(MOCK_SCREENS)); return; }
  api.get<Screen[]>('/api/screens')
    .then((data) => callback(ok(Array.isArray(data) ? data : MOCK_SCREENS)))
    .catch(() => callback(ok(MOCK_SCREENS)));
};

export const getScreenByIdApi = (
  id: number,
  callback: (response: SocketResponse<Screen>) => void,
) => {
  if (isMock()) {
    const screen = MOCK_SCREENS.find((s) => s.id === id);
    callback(screen ? ok(screen) : { res_code: 1, error_cont: 'Không tìm thấy màn hình' });
    return;
  }
  api.get<Screen>(`/api/screens/${id}`)
    .then((data) => callback(ok(data)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const updateScreenApi = (
  id: number,
  data: { name?: string; description?: string },
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) { callback(ok(undefined)); return; }
  api.put(`/api/screens/${id}`, data)
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};

export const deleteScreenApi = (
  id: number,
  callback: (response: SocketResponse) => void,
) => {
  if (isMock()) { callback(ok(undefined)); return; }
  api.delete(`/api/screens/${id}`)
    .then(() => callback(ok(undefined)))
    .catch((e: Error) => callback({ res_code: 1, error_cont: e.message }));
};
