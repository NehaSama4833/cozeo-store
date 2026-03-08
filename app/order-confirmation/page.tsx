'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Clock, Home, ShoppingBag } from 'lucide-react';
import { getOrderById } from '@/lib/supabase/client';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (orderId) {
        const data = await getOrderById(orderId);
        setOrder(data);
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-20 bg-white/5 rounded-xl" />
            <div className="h-40 bg-white/5 rounded-xl" />
            <div className="h-60 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-cozeo-grey mb-8">
            We could not find the order you are looking for.
          </p>
          <Link href="/shop">
            <Button className="bg-white text-cozeo-black hover:bg-cozeo-grey-light">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Order Confirmed!
          </h1>
          <p className="text-cozeo-grey">
            Thank you for your order. We will send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 md:p-8 mb-6">
          {/* Order Number & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/10">
            <div>
              <p className="text-cozeo-grey text-sm">Order Number</p>
              <p className="text-white text-xl font-semibold">{order.order_number}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`
                inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                ${order.payment_status === 'paid' 
                  ? 'bg-green-500/20 text-green-400' 
                  : order.payment_method === 'cod'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
                }
              `}>
                {order.payment_status === 'paid' 
                  ? 'Payment Confirmed' 
                  : order.payment_method === 'cod'
                  ? 'Cash on Delivery'
                  : 'Payment Pending'
                }
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="py-6 border-b border-white/10">
            <h3 className="text-white font-semibold mb-4">Order Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cozeo-blue flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-cozeo-grey mt-2">Ordered</span>
              </div>
              <div className="flex-1 h-0.5 bg-white/10 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Package className="w-5 h-5 text-cozeo-grey" />
                </div>
                <span className="text-xs text-cozeo-grey mt-2">Processing</span>
              </div>
              <div className="flex-1 h-0.5 bg-white/10 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-cozeo-grey" />
                </div>
                <span className="text-xs text-cozeo-grey mt-2">Shipped</span>
              </div>
              <div className="flex-1 h-0.5 bg-white/10 mx-2" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Home className="w-5 h-5 text-cozeo-grey" />
                </div>
                <span className="text-xs text-cozeo-grey mt-2">Delivered</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="py-6 border-b border-white/10">
            <h3 className="text-white font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-cozeo-grey-dark overflow-hidden">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.product_name}</p>
                      <p className="text-cozeo-grey text-sm">
                        {item.size} / {item.color} / Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-white font-medium">
                    ₹{item.total.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="py-6 border-b border-white/10">
            <h3 className="text-white font-semibold mb-4">Shipping Address</h3>
            <div className="text-cozeo-grey">
              <p className="text-white font-medium">{order.shipping_address.fullName}</p>
              <p>{order.shipping_address.addressLine1}</p>
              {order.shipping_address.addressLine2 && (
                <p>{order.shipping_address.addressLine2}</p>
              )}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              </p>
              <p className="mt-2">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="py-6 border-b border-white/10">
            <h3 className="text-white font-semibold mb-4">Payment Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cozeo-grey">Payment Method</span>
                <span className="text-white capitalize">
                  {order.payment_method === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cozeo-grey">Payment Status</span>
                <span className={order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cozeo-grey">Subtotal</span>
                <span className="text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cozeo-grey">Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-semibold text-xl">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Important Information</h4>
              <ul className="text-cozeo-grey text-sm space-y-1">
                <li>Orders are typically processed within 1-2 business days.</li>
                <li>Delivery takes 3-7 business days depending on your location.</li>
                <li>Cash on Delivery orders will be confirmed after verification.</li>
                <li>No returns or refunds accepted.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-white text-cozeo-black hover:bg-cozeo-grey-light">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
