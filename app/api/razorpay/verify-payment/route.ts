import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body;

    // Validate required fields
    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Update order with failed payment status
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('id', orderId);

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update order with successful payment
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_payment_id,
        order_status: 'processing',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
