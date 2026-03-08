import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/lib/supabase/client';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CZ${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      subtotal,
      shipping_cost,
      total,
      payment_method,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database first
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          items,
          subtotal,
          shipping_cost,
          total,
          payment_method,
          payment_status: payment_method === 'cod' ? 'pending' : 'pending',
          order_status: 'pending',
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // For COD, return the order directly
    if (payment_method === 'cod') {
      return NextResponse.json({
        success: true,
        order,
        message: 'Order created successfully',
      });
    }

    // For Razorpay, create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        order_id: order.id,
        customer_email,
        customer_phone,
      },
    });

    // Update order with Razorpay order ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Razorpay ID:', updateError);
    }

    return NextResponse.json({
      success: true,
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
