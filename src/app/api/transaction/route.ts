/**
 * Transaction API Route - Server-side proxy to Transaction Service
 *
 * This route handles transaction operations:
 * - GET: Fetch all transactions
 */

import { NextResponse } from 'next/server';
import { getAllTransactions } from '@/lib/api';

// GET /api/transaction - Get all transactions
export async function GET() {
  try {
    const data = await getAllTransactions();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to transaction service' },
      { status: 500 }
    );
  }
}
