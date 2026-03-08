'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success('Removed from cart', {
      description: name,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Your Cart</h1>
          
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-cozeo-grey" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-cozeo-grey mb-8 text-center max-w-md">
              Looks like you have not added anything to your cart yet. 
              Explore our collection of premium hoodies.
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Your Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-cozeo-grey hover:text-red-400 text-sm transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-full sm:w-32 h-40 sm:h-32 rounded-lg overflow-hidden bg-cozeo-grey-dark flex-shrink-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-white font-medium hover:text-cozeo-grey transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="mt-1 flex items-center space-x-3 text-sm text-cozeo-grey">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="p-2 text-cozeo-grey hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="inline-flex items-center text-cozeo-grey hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-cozeo-grey">Items ({totalItems})</span>
                  <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cozeo-grey">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-semibold text-xl">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-cozeo-grey mt-1">
                    Including all taxes
                  </p>
                </div>
              </div>

              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full mt-6 bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold py-6"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-6 space-y-2 text-xs text-cozeo-grey text-center">
                <p>Free shipping across India</p>
                <p>Cash on Delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
