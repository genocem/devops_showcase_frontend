/**
 * Stock Item API Route - Server-side proxy for individual stock operations
 *
 * This route handles operations on individual stock items:
 * - GET: Fetch a specific stock item by ID
 * - PUT: Update a stock item
 * - DELETE: Delete a stock item
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStockById, updateStock, deleteStock } from '@/lib/api';

function toResponseWithStatus(data: Record<string, unknown>) {
  const status = typeof data.status === 'number'
    ? data.status
    : data.success === false
      ? 500
      : 200;

  return NextResponse.json(data, { status });
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/stock/[id] - Get stock item by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await getStockById(id);
    return toResponseWithStatus(data);
  } catch (error) {
    console.error('Error fetching stock item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stock item' },
      { status: 500 }
    );
  }
}

// PUT /api/stock/[id] - Update stock item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { available_quantity, price } = body;

    if (available_quantity === undefined) {
      return NextResponse.json(
        { success: false, message: 'available_quantity is required' },
        { status: 400 }
      );
    }

    const data = await updateStock(id, available_quantity, price);
    return toResponseWithStatus(data);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update stock item' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/[id] - Delete stock item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await deleteStock(id);
    return toResponseWithStatus(data);
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete stock item' },
      { status: 500 }
    );
  }
}
