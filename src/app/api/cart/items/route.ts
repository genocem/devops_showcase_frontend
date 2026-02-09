/**
 * Cart Items API Route - Server-side proxy for cart item operations
 *
 * This route handles adding items to cart:
 * - POST: Add an item to cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { addItemToCart } from '@/lib/api';

// POST /api/cart/items - Add item to cart
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

    const body = await request.json();
    const { product_id, product_name, quantity, price } = body;

    if (!product_id || !product_name || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'product_id, product_name, quantity, and price are required' },
        { status: 400 }
      );
    }

    const data = await addItemToCart(token, product_id, product_name, quantity, price);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
