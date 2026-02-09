/**
 * Transaction Item API Route - Server-side proxy for individual transaction operations
 *
 * This route handles operations on individual transactions:
 * - GET: Fetch a specific transaction by ID
 * - PUT: Update transaction status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTransactionById, updateTransactionStatus } from '@/lib/api';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/transaction/[id] - Get transaction by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await getTransactionById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transaction/[id] - Update transaction status
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, cart_id } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'status is required' },
        { status: 400 }
      );
    }

    const data = await updateTransactionStatus(id, status, cart_id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}
