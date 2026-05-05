import { api, API_BASE, extractRows } from '@app/services/api';

export type ShiftStatus = 'OPEN' | 'CLOSED';

export interface ShiftSession {
  id: string;
  branchId: string;
  branchName?: string;
  openedBy: string;
  closedBy?: string;
  openedAt: string;
  closedAt?: string;
  status: ShiftStatus;
  openCash: number;
  closeCash?: number;
  totalOrders?: number;
  totalRevenue?: number;
  notes?: string;
}

export interface OpenShiftPayload {
  branchId: string;
  openCash: number;
  notes?: string;
}

export interface CloseShiftPayload {
  closeCash: number;
  notes?: string;
}

const MOCK: ShiftSession[] = [
  {
    id: 's1',
    branchId: '1',
    branchName: 'Chi nhánh Quận 1',
    openedBy: 'Nguyễn Thị Lan',
    closedBy: 'Nguyễn Thị Lan',
    openedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    closedAt: new Date(Date.now() - 86400000 * 2 + 28800000).toISOString(),
    status: 'CLOSED',
    openCash: 500000,
    closeCash: 3200000,
    totalOrders: 42,
    totalRevenue: 2700000,
    notes: 'Ca bình thường',
  },
  {
    id: 's2',
    branchId: '1',
    branchName: 'Chi nhánh Quận 1',
    openedBy: 'Trần Văn Minh',
    closedBy: 'Trần Văn Minh',
    openedAt: new Date(Date.now() - 86400000).toISOString(),
    closedAt: new Date(Date.now() - 86400000 + 32400000).toISOString(),
    status: 'CLOSED',
    openCash: 500000,
    closeCash: 4100000,
    totalOrders: 58,
    totalRevenue: 3600000,
    notes: 'Cuối tuần đông khách',
  },
];

export const shiftSessionService = {
  async getAll(status?: ShiftStatus): Promise<ShiftSession[]> {
    if (!API_BASE) {
      if (status) return MOCK.filter((s) => s.status === status);
      return [...MOCK];
    }
    const qs = status ? `?status=${status}` : '';
    const data = await api.get<unknown>(`/api/shift-sessions${qs}`);
    return extractRows<ShiftSession>(data);
  },

  async getById(id: string): Promise<ShiftSession> {
    if (!API_BASE) {
      const found = MOCK.find((s) => s.id === id);
      if (!found) throw new Error('Ca không tồn tại');
      return found;
    }
    return api.get<ShiftSession>(`/api/shift-sessions/${id}`);
  },

  async open(payload: OpenShiftPayload): Promise<ShiftSession> {
    if (!API_BASE) {
      const item: ShiftSession = {
        id: Date.now().toString(),
        branchId: payload.branchId,
        branchName: 'Chi nhánh hiện tại',
        openedBy: 'Admin',
        openedAt: new Date().toISOString(),
        status: 'OPEN',
        openCash: payload.openCash,
        notes: payload.notes,
        totalOrders: 0,
        totalRevenue: 0,
      };
      MOCK.unshift(item);
      return item;
    }
    return api.post<ShiftSession>('/api/shift-sessions/open', payload);
  },

  async close(id: string, payload: CloseShiftPayload): Promise<ShiftSession> {
    if (!API_BASE) {
      const i = MOCK.findIndex((s) => s.id === id);
      if (i !== -1) {
        MOCK[i] = {
          ...MOCK[i],
          status: 'CLOSED',
          closedAt: new Date().toISOString(),
          closedBy: 'Admin',
          closeCash: payload.closeCash,
          notes: payload.notes ?? MOCK[i].notes,
        };
        return MOCK[i];
      }
      throw new Error('Ca không tồn tại');
    }
    return api.post<ShiftSession>(`/api/shift-sessions/${id}/close`, payload);
  },
};
