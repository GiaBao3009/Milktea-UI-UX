import { api, API_BASE } from '@app/services/api';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  status: 'active' | 'inactive';
}
export type StaffPayload = Omit<StaffUser, 'id'>;

const MOCK: StaffUser[] = [
  { id: '1', name: 'Nguyễn Thị Lan', email: 'lan@chips.vn', phone: '0901111111', role: 'Manager', branch: 'Chi nhánh Q1', status: 'active' },
  { id: '2', name: 'Trần Văn Minh', email: 'minh@chips.vn', phone: '0902222222', role: 'Manager', branch: 'Chi nhánh Q3', status: 'active' },
  { id: '3', name: 'Lê Thị Hoa', email: 'hoa@chips.vn', phone: '0903333333', role: 'Cashier', branch: 'Chi nhánh Q1', status: 'active' },
];

export const userService = {
  async getAll(): Promise<StaffUser[]> {
    if (!API_BASE) return [...MOCK];
    const res = await api.get<{ data: StaffUser[] }>('/api/account/users');
    return res.data;
  },
  async create(payload: StaffPayload): Promise<StaffUser> {
    if (!API_BASE) { const item = { ...payload, id: Date.now().toString() }; MOCK.push(item); return item; }
    return api.post<StaffUser>('/api/account/users', payload);
  },
  async update(id: string, payload: StaffPayload): Promise<StaffUser> {
    if (!API_BASE) { const i = MOCK.findIndex((u) => u.id === id); if (i !== -1) MOCK[i] = { ...MOCK[i], ...payload }; return MOCK[i]; }
    return api.put<StaffUser>(`/api/account/users/${id}`, payload);
  },
};
