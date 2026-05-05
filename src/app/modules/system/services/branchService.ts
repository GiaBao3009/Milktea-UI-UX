import { api, API_BASE, extractRows } from '@app/services/api';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  manager?: string;
}

export type BranchPayload = Omit<Branch, 'id'>;

const MOCK: Branch[] = [
  { id: '1', name: 'Chi nhánh Quận 1', address: '123 Nguyễn Huệ, Q.1, TP.HCM', phone: '0281234567', email: 'q1@chips.vn', status: 'active', manager: 'Nguyễn Thị Lan' },
  { id: '2', name: 'Chi nhánh Quận 3', address: '456 Võ Văn Tần, Q.3, TP.HCM', phone: '0282345678', email: 'q3@chips.vn', status: 'active', manager: 'Trần Văn Minh' },
  { id: '3', name: 'Chi nhánh Quận 7', address: '789 Nguyễn Văn Linh, Q.7, TP.HCM', phone: '0283456789', email: 'q7@chips.vn', status: 'active', manager: 'Lê Thị Hoa' },
];

export const branchService = {
  async getAll(): Promise<Branch[]> {
    if (!API_BASE) return MOCK;
    const res = await api.get<unknown>('/api/branches?limit=50');
    return extractRows<Branch>(res);
  },

  async create(payload: BranchPayload): Promise<Branch> {
    if (!API_BASE) {
      const newItem: Branch = { ...payload, id: Date.now().toString() };
      MOCK.push(newItem);
      return newItem;
    }
    return api.post<Branch>('/api/branches', payload);
  },

  async update(id: string, payload: BranchPayload): Promise<Branch> {
    if (!API_BASE) {
      const i = MOCK.findIndex((b) => b.id === id);
      if (i !== -1) MOCK[i] = { ...MOCK[i], ...payload };
      return MOCK[i] ?? ({ id, ...payload } as Branch);
    }
    return api.put<Branch>(`/api/branches/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (!API_BASE) {
      const i = MOCK.findIndex((b) => b.id === id);
      if (i !== -1) MOCK.splice(i, 1);
      return;
    }
    await api.delete(`/api/branches/${id}`);
  },
};
