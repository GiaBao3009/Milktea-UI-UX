import { api, API_BASE, extractRows } from '@app/services/api';

export interface AttributeOption {
  id: string;
  label: string;
  price?: number;
  isDefault?: boolean;
}

export interface AttributeGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  status: 'active' | 'inactive';
  options: AttributeOption[];
}

export type AttributeGroupPayload = Omit<AttributeGroup, 'id'>;

const MOCK: AttributeGroup[] = [
  {
    id: 'a1',
    name: 'Size',
    type: 'single',
    required: true,
    status: 'active',
    options: [
      { id: 'o1', label: 'S', price: 0, isDefault: false },
      { id: 'o2', label: 'M', price: 5000, isDefault: true },
      { id: 'o3', label: 'L', price: 10000, isDefault: false },
    ],
  },
  {
    id: 'a2',
    name: 'Đá',
    type: 'single',
    required: true,
    status: 'active',
    options: [
      { id: 'o4', label: 'Không đá', price: 0, isDefault: false },
      { id: 'o5', label: 'Ít đá', price: 0, isDefault: false },
      { id: 'o6', label: 'Đá bình thường', price: 0, isDefault: true },
      { id: 'o7', label: 'Nhiều đá', price: 0, isDefault: false },
    ],
  },
  {
    id: 'a3',
    name: 'Đường',
    type: 'single',
    required: false,
    status: 'active',
    options: [
      { id: 'o8', label: '0%', price: 0, isDefault: false },
      { id: 'o9', label: '30%', price: 0, isDefault: false },
      { id: 'o10', label: '50%', price: 0, isDefault: true },
      { id: 'o11', label: '70%', price: 0, isDefault: false },
      { id: 'o12', label: '100%', price: 0, isDefault: false },
    ],
  },
  {
    id: 'a4',
    name: 'Topping',
    type: 'multiple',
    required: false,
    status: 'active',
    options: [
      { id: 'o13', label: 'Trân châu đen', price: 10000, isDefault: false },
      { id: 'o14', label: 'Trân châu trắng', price: 10000, isDefault: false },
      { id: 'o15', label: 'Pudding', price: 12000, isDefault: false },
      { id: 'o16', label: 'Thạch dừa', price: 8000, isDefault: false },
      { id: 'o17', label: 'Kem cheese', price: 15000, isDefault: false },
    ],
  },
];

export const attributeService = {
  async getAll(): Promise<AttributeGroup[]> {
    if (!API_BASE) return [...MOCK.map((g) => ({ ...g, options: [...g.options] }))];
    const data = await api.get<unknown>('/api/attributes');
    return extractRows<AttributeGroup>(data);
  },

  async create(payload: AttributeGroupPayload): Promise<AttributeGroup> {
    if (!API_BASE) {
      const item: AttributeGroup = { ...payload, id: Date.now().toString() };
      MOCK.push(item);
      return item;
    }
    return api.post<AttributeGroup>('/api/attributes', payload);
  },

  async update(id: string, payload: AttributeGroupPayload): Promise<AttributeGroup> {
    if (!API_BASE) {
      const i = MOCK.findIndex((g) => g.id === id);
      if (i !== -1) MOCK[i] = { ...MOCK[i], ...payload };
      return MOCK[i] ?? ({ id, ...payload } as AttributeGroup);
    }
    return api.put<AttributeGroup>(`/api/attributes/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    if (!API_BASE) {
      const i = MOCK.findIndex((g) => g.id === id);
      if (i !== -1) MOCK.splice(i, 1);
      return;
    }
    await api.delete(`/api/attributes/${id}`);
  },
};
