export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  tags: string[];
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: 'razorpay' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SIZE_CHART = {
  S: { chest: '38"', length: '26"', sleeve: '24"' },
  M: { chest: '40"', length: '27"', sleeve: '25"' },
  L: { chest: '42"', length: '28"', sleeve: '26"' },
  XL: { chest: '44"', length: '29"', sleeve: '27"' },
  XXL: { chest: '46"', length: '30"', sleeve: '28"' },
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];
