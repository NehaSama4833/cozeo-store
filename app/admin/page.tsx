'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, ShoppingCart, Users, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import { getProducts, getAllOrders, deleteProduct } from '@/lib/supabase/client';
import { Product, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    async function loadData() {
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getAllOrders(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const success = await deleteProduct(id);
    if (success) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } else {
      toast.error('Failed to delete product');
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders
      .filter((o) => o.payment_status === 'paid' || o.payment_method === 'cod')
      .reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter((o) => o.order_status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/5 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-cozeo-grey hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cozeo-blue/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-cozeo-blue" />
              </div>
              <div>
                <p className="text-cozeo-grey text-sm">Products</p>
                <p className="text-white text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-cozeo-grey text-sm">Orders</p>
                <p className="text-white text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-cozeo-grey text-sm">Revenue</p>
                <p className="text-white text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-cozeo-grey text-sm">Pending</p>
                <p className="text-white text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'pb-4 text-sm font-medium transition-colors relative',
              activeTab === 'products'
                ? 'text-white'
                : 'text-cozeo-grey hover:text-white'
            )}
          >
            Products
            {activeTab === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cozeo-blue" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'pb-4 text-sm font-medium transition-colors relative',
              activeTab === 'orders'
                ? 'text-white'
                : 'text-cozeo-grey hover:text-white'
            )}
          >
            Orders
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cozeo-blue" />
            )}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Products</h2>
              <Button className="bg-white text-cozeo-black hover:bg-cozeo-grey-light">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Product</th>
                    <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Price</th>
                    <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Stock</th>
                    <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Status</th>
                    <th className="text-right py-4 px-4 text-cozeo-grey text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cozeo-grey-dark">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-cozeo-grey text-xs">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white">₹{product.price.toLocaleString('en-IN')}</div>
                        {product.original_price && (
                          <div className="text-cozeo-grey text-xs line-through">
                            ₹{product.original_price.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{product.stock_quantity}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            product.in_stock
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          )}
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-cozeo-grey hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-cozeo-grey hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Orders</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Order #</th>
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Customer</th>
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Date</th>
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Total</th>
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Payment</th>
                      <th className="text-left py-4 px-4 text-cozeo-grey text-sm font-medium">Status</th>
                      <th className="text-right py-4 px-4 text-cozeo-grey text-sm font-medium">Actions</th>
                    </tr>
                   </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{order.order_number}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{order.customer_name}</p>
                          <p className="text-cozeo-grey text-xs">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-cozeo-grey text-sm">
                          {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-white text-sm capitalize">
                            {order.payment_method === 'razorpay' ? 'Online' : 'COD'}
                          </span>
                          <span
                            className={cn(
                              'text-xs',
                              order.payment_status === 'paid'
                                ? 'text-green-400'
                                : order.payment_status === 'failed'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            )}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>
                     <td className="py-4 px-4">
  <span
    className={cn(
      'px-2 py-1 rounded text-xs font-medium capitalize',
      order.order_status === 'delivered'
        ? 'bg-green-500/20 text-green-400'
        : order.order_status === 'cancelled'
        ? 'bg-red-500/20 text-red-400'
        : order.order_status === 'shipped'
        ? 'bg-blue-500/20 text-blue-400'
        : 'bg-yellow-500/20 text-yellow-400'
    )}
  >
    {order.order_status}
  </span>
</td>

<td className="py-4 px-4 text-right">
  <Link href={`/admin/packing-slip/${order.id}`}>
    <button className="bg-cozeo-blue text-white px-3 py-1 rounded text-sm hover:opacity-80">
      Print Slip
    </button>
  </Link>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-cozeo-grey">No orders yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
