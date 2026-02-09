/**
 * Cart Checkout API Route - Server-side proxy for checkout operation
 *
 * This route handles checkout:
 * - POST: Checkout the cart (creates a transaction)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkoutCart } from '@/lib/api';

// POST /api/cart/checkout - Checkout cart
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const data = await checkoutCart(token);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking out cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to checkout cart' },
      { status: 500 }
    );
  }
}
