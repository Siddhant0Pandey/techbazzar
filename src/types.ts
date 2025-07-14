export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  title: string;
  titleNp?: string;
  slug: string;
  description: string;
  descriptionNp?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'cash_on_delivery' | 'esewa' | 'khalti' | 'bank_transfer' | 'card';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

export interface Category {
  id: string;
  name: string;
  nameNp?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}