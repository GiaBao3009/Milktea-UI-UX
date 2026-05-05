import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AttributeOption {
  id: string;
  label: string;
  priceAdd?: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  options: AttributeOption[];
  required: boolean;
  multiSelect?: boolean;
}

const DEFAULT_ATTRIBUTES: ProductAttribute[] = [
  {
    id: 'size',
    name: 'Kích cỡ',
    options: [
      { id: 'S', label: 'Nhỏ', priceAdd: -5000 },
      { id: 'M', label: 'Vừa', priceAdd: 0 },
      { id: 'L', label: 'Lớn', priceAdd: 10000 },
    ],
    required: true,
  },
  {
    id: 'sugar',
    name: 'Mức đường',
    options: [
      { id: 'sugar-0', label: '0%' },
      { id: 'sugar-30', label: '30%' },
      { id: 'sugar-50', label: '50%' },
      { id: 'sugar-70', label: '70%' },
      { id: 'sugar-100', label: '100%' },
    ],
    required: true,
  },
  {
    id: 'ice',
    name: 'Mức đá',
    options: [
      { id: 'ice-none', label: 'Không đá' },
      { id: 'ice-separate', label: 'Đá riêng' },
      { id: 'ice-less', label: 'Ít đá' },
      { id: 'ice-normal', label: 'Đá bình thường' },
    ],
    required: true,
  },
  {
    id: 'toppings',
    name: 'Topping',
    options: [
      { id: 'top-tc-den', label: 'Trân Châu Đen', priceAdd: 10000 },
      { id: 'top-tc-trang', label: 'Trân Châu Trắng', priceAdd: 10000 },
      { id: 'top-thach-dao', label: 'Thạch Đào', priceAdd: 8000 },
      { id: 'top-thach-cf', label: 'Thạch Cà Phê', priceAdd: 8000 },
      { id: 'top-kem-pho-mai', label: 'Kem Phô Mai', priceAdd: 12000 },
      { id: 'top-dau-do', label: 'Đậu Đỏ', priceAdd: 7000 },
    ],
    required: false,
    multiSelect: true,
  },
];

/** Returns default selected option IDs for single-select attributes only. */
function getDefaultSelections(attrs: ProductAttribute[]): Record<string, string> {
  const sel: Record<string, string> = {};
  attrs
    .filter((a) => !a.multiSelect)
    .forEach((attr) => {
      if (attr.options.length === 0) return;
      if (attr.id === 'size') {
        const m = attr.options.find((o) => o.id === 'M');
        sel[attr.id] = m?.id ?? attr.options[0].id;
      } else if (attr.id === 'sugar') {
        const half = attr.options.find((o) => o.label === '50%');
        sel[attr.id] = half?.id ?? attr.options[0].id;
      } else if (attr.id === 'ice') {
        const normal = attr.options.find((o) => o.label === 'Đá bình thường');
        sel[attr.id] = normal?.id ?? attr.options[0].id;
      } else {
        sel[attr.id] = attr.options[0].id;
      }
    });
  return sel;
}

interface AttributesContextValue {
  attributes: ProductAttribute[];
  hasAttributes: boolean;
  getDefaultSelections: (attrs: ProductAttribute[]) => Record<string, string>;
  addAttribute: (attr: ProductAttribute) => void;
  removeAttribute: (id: string) => void;
  updateAttribute: (id: string, updates: Partial<ProductAttribute>) => void;
}

const AttributesContext = createContext<AttributesContextValue | null>(null);

export function AttributesProvider({ children }: { children: ReactNode }) {
  const [attributes, setAttributes] = useState<ProductAttribute[]>(DEFAULT_ATTRIBUTES);

  const hasAttributes = attributes.length > 0;

  const addAttribute = (attr: ProductAttribute) =>
    setAttributes((prev) => [...prev, attr]);

  const removeAttribute = (id: string) =>
    setAttributes((prev) => prev.filter((a) => a.id !== id));

  const updateAttribute = (id: string, updates: Partial<ProductAttribute>) =>
    setAttributes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );

  return (
    <AttributesContext.Provider
      value={{ attributes, hasAttributes, getDefaultSelections, addAttribute, removeAttribute, updateAttribute }}
    >
      {children}
    </AttributesContext.Provider>
  );
}

export function useAttributes() {
  const ctx = useContext(AttributesContext);
  if (!ctx) throw new Error('useAttributes must be used within AttributesProvider');
  return ctx;
}
