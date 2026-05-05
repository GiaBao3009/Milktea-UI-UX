import { api, API_BASE, extractRows } from '@app/services/api';

export interface ProductSize { size: string; price: number; }

export interface ProductAttribute {
  id?: number;
  attributeId: number;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  sizes: ProductSize[];          // normalized for UI display
  status: 'active' | 'inactive';
  image?: string;
  imageUrl?: string;
  description?: string;
  basePrice?: number;
  isActive?: string;
  productAttributes?: ProductAttribute[];
}

export interface ProductPayload {
  name: string;
  categoryId: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isActive: string;              // "1" | "0"
  productAttributes: ProductAttribute[];
}

export interface Category {
  id: string;
  name: string;
  productCount?: number;
  status: 'active' | 'inactive';
  sortOrder?: number;
}

export type CategoryPayload = Omit<Category, 'id' | 'productCount'>;
type CategoryApiPayload = {
  name: string;
  sortOrder?: number;
};

const MOCK_CATS: Category[] = [
  { id: 'c1', name: 'Trà Sữa', productCount: 12, status: 'active' },
  { id: 'c2', name: 'Trà Trái Cây', productCount: 8, status: 'active' },
  { id: 'c3', name: 'Cà Phê', productCount: 6, status: 'active' },
];
const MOCK_PRODS: Product[] = [
  { id: 'p1', name: 'Trà Sữa Trân Châu', categoryId: 'c1', categoryName: 'Trà Sữa', sizes: [{ size: 'M', price: 35000 }, { size: 'L', price: 45000 }], status: 'active' },
  { id: 'p2', name: 'Trà Đào Cam Sả', categoryId: 'c2', categoryName: 'Trà Trái Cây', sizes: [{ size: 'M', price: 30000 }, { size: 'L', price: 40000 }], status: 'active' },
  { id: 'p3', name: 'Cà Phê Sữa Đá', categoryId: 'c3', categoryName: 'Cà Phê', sizes: [{ size: 'M', price: 35000 }, { size: 'L', price: 42000 }], status: 'active' },
];

function toProductSize(item: unknown): ProductSize | null {
  if (!item || typeof item !== 'object') return null;
  const data = item as Record<string, unknown>;
  const rawSize = data.size ?? data.name ?? data.label ?? data.sizeName ?? 'M';
  const rawPrice = data.price ?? data.salePrice ?? data.basePrice ?? data.value ?? 0;

  return {
    size: String(rawSize || 'M'),
    price: Number(rawPrice) || 0,
  };
}

function normalizeProduct(raw: Product): Product {
  const data = raw as Product & Record<string, unknown>;
  const category = data.category as Record<string, unknown> | undefined;
  const rawSizes =
    data.sizes ??
    data.productSizes ??
    data.sizePrices ??
    data.variants ??
    data.options;
  const sizes = Array.isArray(rawSizes)
    ? rawSizes.map(toProductSize).filter((size): size is ProductSize => size !== null)
    : [];

  return {
    ...raw,
    id: String(data.id ?? ''),
    name: String(data.name ?? ''),
    categoryId: String(data.categoryId ?? data.category_id ?? category?.id ?? ''),
    categoryName: String(data.categoryName ?? data.category_name ?? category?.name ?? ''),
    sizes: sizes.length > 0 ? sizes : [{ size: 'M', price: Number(data.price ?? data.basePrice ?? data.salePrice) || 0 }],
    status: data.status === 'inactive' ? 'inactive' : 'active',
  };
}

function normalizeCategory(raw: Category): Category {
  const data = raw as Category & Record<string, unknown>;
  const isActive = data.isActive ?? data.is_active;

  return {
    ...raw,
    id: String(data.id ?? ''),
    name: String(data.name ?? ''),
    productCount: Number(data.productCount ?? data.product_count ?? 0),
    sortOrder: data.sortOrder != null ? Number(data.sortOrder) : undefined,
    status: isActive === '0' || isActive === 0 || data.status === 'inactive' ? 'inactive' : 'active',
  };
}

function toCategoryApiPayload(payload: CategoryPayload): CategoryApiPayload {
  return {
    name: payload.name,
    sortOrder: payload.sortOrder ?? 1,
  };
}

/** Chuyển form payload → đúng format BE yêu cầu */
function toProductApiPayload(payload: ProductPayload): Record<string, unknown> {
  return {
    name: payload.name,
    categoryId: payload.categoryId,
    basePrice: payload.basePrice,
    isActive: payload.isActive,
    ...(payload.description ? { description: payload.description } : {}),
    ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
    ...(payload.productAttributes?.length ? { productAttributes: payload.productAttributes } : {}),
  };
}

export const productService = {
  async getCategories(): Promise<Category[]> {
    if (!API_BASE) return [...MOCK_CATS];
    const data = await api.get<unknown>('/api/product-categories?isActive=1&limit=50');
    return extractRows<Category>(data).map(normalizeCategory);
  },
  async createCategory(payload: CategoryPayload): Promise<Category> {
    if (!API_BASE) { const item = { ...payload, id: Date.now().toString(), productCount: 0 }; MOCK_CATS.push(item); return item; }
    const category = await api.post<Category>('/api/product-categories', toCategoryApiPayload(payload));
    return normalizeCategory(category);
  },
  async updateCategory(id: string, payload: CategoryPayload): Promise<Category> {
    if (!API_BASE) { const i = MOCK_CATS.findIndex((c) => c.id === id); if (i !== -1) MOCK_CATS[i] = { ...MOCK_CATS[i], ...payload }; return MOCK_CATS[i]; }
    const category = await api.put<Category>(`/api/product-categories/${id}`, toCategoryApiPayload(payload));
    return normalizeCategory(category);
  },
  async removeCategory(id: string): Promise<void> {
    if (!API_BASE) { const i = MOCK_CATS.findIndex((c) => c.id === id); if (i !== -1) MOCK_CATS.splice(i, 1); return; }
    await api.delete(`/api/product-categories/${id}`);
  },
  async getProducts(params?: { categoryId?: string }): Promise<Product[]> {
    if (!API_BASE) {
      const catMap = Object.fromEntries(MOCK_CATS.map((c) => [c.id, c.name]));
      let list = MOCK_PRODS.map((p) => ({ ...p, categoryName: catMap[p.categoryId] }));
      if (params?.categoryId) list = list.filter((p) => p.categoryId === params.categoryId);
      return list;
    }
    const qs = new URLSearchParams({ isActive: '1', limit: '100' });
    if (params?.categoryId) qs.set('categoryId', params.categoryId);
    const data = await api.get<unknown>(`/api/products?${qs}`);
    return extractRows<Product>(data).map(normalizeProduct);
  },
  async createProduct(payload: ProductPayload): Promise<Product> {
    if (!API_BASE) {
      const item: Product = { ...payload, id: Date.now().toString(), sizes: [{ size: 'M', price: payload.basePrice }], status: 'active' };
      MOCK_PRODS.push(item); return item;
    }
    const product = await api.post<Product>('/api/products', toProductApiPayload(payload));
    return normalizeProduct(product);
  },
  async updateProduct(id: string, payload: ProductPayload): Promise<Product> {
    if (!API_BASE) {
      const i = MOCK_PRODS.findIndex((p) => p.id === id);
      if (i !== -1) MOCK_PRODS[i] = { ...MOCK_PRODS[i], ...payload, sizes: [{ size: 'M', price: payload.basePrice }] };
      return MOCK_PRODS[i];
    }
    const product = await api.put<Product>(`/api/products/${id}`, toProductApiPayload(payload));
    return normalizeProduct(product);
  },
  async removeProduct(id: string): Promise<void> {
    if (!API_BASE) { const i = MOCK_PRODS.findIndex((p) => p.id === id); if (i !== -1) MOCK_PRODS.splice(i, 1); return; }
    await api.delete(`/api/products/${id}`);
  },
};
