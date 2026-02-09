/**
 * Cart Item API Route - Server-side proxy for individual cart item operations
 *
 * This route handles operations on individual cart items:
 * - PUT: Update item quantity
 * - DELETE: Remove item from cart
 *
 * The [productName] param is URL-encoded on client side
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeCartItem } from '@/lib/api';

interface RouteParams {
  params: Promise<{ productName: string }>;
}

// PUT /api/cart/items/[productName] - Update cart item quantity
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { productName } = await params;
    const decodedProductName = decodeURIComponent(productName);
    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined) {
      return NextResponse.json(
        { success: false, message: 'quantity is required' },
        { status: 400 }
      );
    }

    const data = await updateCartItem(token, decodedProductName, quantity);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[productName] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { productName } = await params;
    const decodedProductName = decodeURIComponent(productName);

    const data = await removeCartItem(token, decodedProductName);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
