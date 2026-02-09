/**
 * Cart API Route - Server-side proxy to Cart Service
 *
 * This route handles cart operations:
 * - GET: Get or create a cart (requires Authorization header with cart token)
 * - DELETE: Delete a cart
 *
 * The cart token is passed via Authorization header from client
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCart, deleteCart } from '@/lib/api';

// GET /api/cart - Get or create cart
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    const data = await getOrCreateCart(token);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to cart service' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Delete cart
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const data = await deleteCart(token);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete cart' },
      { status: 500 }
    );
  }
}
