export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'matcha' | 'botanical' | 'cold-brew' | 'wellness' | 'seasonal';
  categoryLabel: string;
  description: string;
  image: string;
  images: string[];
  rating?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  badge?: string;
}

export const CATEGORIES = [
  { id: 'matcha', label: 'Trà sữa đặc trưng' },
  { id: 'botanical', label: 'Trà trái cây' },
  { id: 'cold-brew', label: 'Kem phủ và pha tầng' },
  { id: 'wellness', label: 'Sữa chua và trà nhẹ' },
  { id: 'seasonal', label: 'Phiên bản theo mùa' },
];

const EXTRA = 'https://images.unsplash.com/photo-1771405317905-44d78aa82d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

export const products: Product[] = [
  {
    id: '1',
    name: 'Trà sữa trân châu đường đen',
    price: 65000,
    category: 'matcha',
    categoryLabel: 'Trà sữa đặc trưng',
    description: 'Nền trà đen đậm vị, sữa tươi mượt và trân châu đường đen nấu mới mỗi ngày cho hậu vị béo sâu.',
    image: 'https://images.unsplash.com/photo-1529474944862-bf4949bd2f1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1529474944862-bf4949bd2f1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.9,
    isBestseller: true,
    badge: 'Bán chạy',
  },
  {
    id: '2',
    name: 'Trà sữa Oolong rang',
    price: 69000,
    category: 'matcha',
    categoryLabel: 'Trà sữa đặc trưng',
    description: 'Oolong rang thơm sâu, hòa cùng lớp sữa béo nhẹ và topping mềm tạo cảm giác tròn vị, dễ nghiện.',
    image: 'https://images.unsplash.com/photo-1552014631-125e3a6b9594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1552014631-125e3a6b9594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Matcha kem sữa trân châu',
    price: 72000,
    category: 'matcha',
    categoryLabel: 'Trà sữa đặc trưng',
    description: 'Giữ tông matcha xanh dịu, phủ thêm kem sữa mặn nhẹ và trân châu mật mía để tổng thể mềm và sang hơn.',
    image: 'https://images.unsplash.com/photo-1592284441621-581ebd2e677d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1592284441621-581ebd2e677d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.8,
    isNew: true,
    badge: 'Mới',
  },
  {
    id: '4',
    name: 'Trà xanh sữa chua nha đam',
    price: 62000,
    category: 'wellness',
    categoryLabel: 'Sữa chua và trà nhẹ',
    description: 'Sữa chua thanh mát, trà xanh dịu hương và nha đam giòn giúp ly nước sạch vị nhưng vẫn đủ thú vị.',
    image: 'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Trà đào Oolong',
    price: 58000,
    category: 'botanical',
    categoryLabel: 'Trà trái cây',
    description: 'Đào vàng, nền oolong thanh và lớp thạch đào mát lạnh cho những ngày cần một vị sáng, dễ uống.',
    image: 'https://images.unsplash.com/photo-1647211429169-624da11ce47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1647211429169-624da11ce47d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.7,
    isBestseller: true,
    badge: 'Nổi bật',
  },
  {
    id: '6',
    name: 'Trà nhài xoài tươi',
    price: 60000,
    category: 'botanical',
    categoryLabel: 'Trà trái cây',
    description: 'Xoài chín, nền trà nhài và chút citrus giữ tổng vị tươi, sáng màu và hợp với không khí thương hiệu.',
    image: 'https://images.unsplash.com/photo-1771405317905-44d78aa82d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1771405317905-44d78aa82d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.7,
    isNew: true,
    badge: 'Mới',
  },
  {
    id: '7',
    name: 'Oolong kem phô mai',
    price: 68000,
    category: 'cold-brew',
    categoryLabel: 'Kem phủ và pha tầng',
    description: 'Oolong lạnh kết hợp lớp kem phô mai mượt, hợp với người thích vị đậm và bề mặt thức uống có chiều sâu.',
    image: 'https://images.unsplash.com/photo-1501841580093-a258b1937efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1501841580093-a258b1937efe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.8,
    isBestseller: true,
    badge: 'Được chọn nhiều',
  },
  {
    id: '8',
    name: 'Trà sữa khoai môn dừa',
    price: 71000,
    category: 'seasonal',
    categoryLabel: 'Phiên bản theo mùa',
    description: 'Khoai môn mềm béo, sữa dừa nhẹ và trân châu tròn vị cho bộ sưu tập giới hạn mang cảm giác mới lạ.',
    image: 'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
    images: [
      'https://images.unsplash.com/photo-1713145230602-3ad16a14ae03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900',
      EXTRA,
    ],
    rating: 4.9,
    isNew: true,
    badge: 'Giới hạn',
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}
