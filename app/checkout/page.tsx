'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, Wallet } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Address, INDIAN_STATES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type PaymentMethod = 'razorpay' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-cozeo-grey mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link href="/shop">
            <Button className="bg-white text-cozeo-black hover:bg-cozeo-grey-light">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof Address)[] = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!address[field]) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    if (address.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (address.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create order in database
      const orderData = {
        customer_name: address.fullName,
        customer_email: address.email,
        customer_phone: address.phone,
        shipping_address: address,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          product_image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: totalPrice,
        shipping_cost: 0,
        total: totalPrice,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        order_status: 'pending',
      };

      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (paymentMethod === 'cod') {
        // For COD, redirect to order confirmation
        clearCart();
        router.push(`/order-confirmation?order_id=${data.order.id}`);
      } else {
        // For Razorpay, open payment modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: 'CoZeo',
          description: 'Premium Streetwear',
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              clearCart();
              router.push(`/order-confirmation?order_id=${data.order.id}`);
            } else {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          theme: {
            color: '#1E3A5F',
          },
          modal: {
            ondismiss: function () {
            console.log("Payment popup closed");
          }
        },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center text-cozeo-grey hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Phone Number <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={address.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-white">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={address.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine1" className="text-white">
                      Address Line 1 <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleInputChange}
                      placeholder="House number, street, area"
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine2" className="text-white">
                      Address Line 2 <span className="text-cozeo-grey">(Optional)</span>
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Apartment, landmark, etc."
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">
                      City <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white">
                      State <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cozeo-blue"
                      required
                    >
                      <option value="" className="bg-cozeo-black">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state} className="bg-cozeo-black">
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-white">
                      Pincode <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={address.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="bg-white/5 border-white/10 text-white placeholder:text-cozeo-grey"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Razorpay */}
                  <label
                    className={cn(
                      'flex items-center p-4 rounded-lg border cursor-pointer transition-all',
                      paymentMethod === 'razorpay'
                        ? 'border-cozeo-blue bg-cozeo-blue/10'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-cozeo-blue" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-white font-medium">Pay Online</div>
                      <div className="text-cozeo-grey text-sm">UPI, Cards, Net Banking</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                      {paymentMethod === 'razorpay' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-cozeo-blue" />
                      )}
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={cn(
                      'flex items-center p-4 rounded-lg border cursor-pointer transition-all',
                      paymentMethod === 'cod'
                        ? 'border-cozeo-blue bg-cozeo-blue/10'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-cozeo-blue" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-white font-medium">Cash on Delivery</div>
                      <div className="text-cozeo-grey text-sm">Pay when you receive</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                      {paymentMethod === 'cod' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-cozeo-blue" />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button - Mobile Only */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold py-6"
                >
                  {isLoading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cozeo-grey-dark flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {item.name}
                      </div>
                      <div className="text-cozeo-grey text-xs">
                        {item.size} / {item.color} / Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-white text-sm">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-cozeo-grey">Subtotal</span>
                  <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cozeo-grey">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-semibold text-xl">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold py-6"
                >
                  {isLoading ? 'Processing...' : `Place Order`}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-cozeo-grey">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-1" />
                  Free Shipping
                </div>
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 mr-1" />
                  COD Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
