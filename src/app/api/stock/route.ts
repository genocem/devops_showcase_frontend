/**
 * Stock API Route - Server-side proxy to Stock Service
 *
 * This route handles all stock-related operations:
 * - GET: Fetch all stock items
 * - POST: Create a new stock item
 *
 * Environment variables are read at runtime (not exposed to client)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllStock, createStock } from '@/lib/api';

function toResponseWithStatus(data: Record<string, unknown>) {
  const status = typeof data.status === 'number'
    ? data.status
    : data.success === false
      ? 500
      : 200;

  return NextResponse.json(data, { status });
}

// GET /api/stock - Get all stock items
export async function GET() {
  try {
    const data = await getAllStock();
    return toResponseWithStatus(data);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to stock service' },
      { status: 500 }
    );
  }
}

// POST /api/stock - Create new stock item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_name, amount, price } = body;

    if (!product_name || amount === undefined) {
      return NextResponse.json(
        { success: false, message: 'product_name and amount are required' },
        { status: 400 }
      );
    }

    const data = await createStock(product_name, amount, price || 0);
    return toResponseWithStatus(data);
  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create stock item' },
      { status: 500 }
    );
  }
}
