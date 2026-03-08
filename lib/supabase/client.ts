import { createClient } from '@supabase/supabase-js';
import { Product, Order } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(4);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

// Orders
export async function createOrder(order: Partial<Order>): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

export async function updateOrderPayment(
  orderId: string,
  paymentData: {
    payment_status: 'paid' | 'failed';
    razorpay_payment_id?: string;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update(paymentData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order payment:', error);
    return false;
  }

  return true;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

// Admin - Products
export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return data;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return false;
  }

  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}
