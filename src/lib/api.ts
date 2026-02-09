/**
 * Server-side API client for backend microservices
 *
 * IMPORTANT: This file should ONLY be used in:
 * - Next.js API routes (app/api/*)
 * - Server Components
 * - Server Actions
 *
 * DO NOT import this file in client components ('use client')
 * Environment variables used here are server-side only and not exposed to the browser.
 */

// These env vars are server-side only (no NEXT_PUBLIC_ prefix)
// They point to internal Docker container URLs
const STOCK_API = process.env.STOCK_SERVICE_URL || 'default';
const CART_API = process.env.CART_SERVICE_URL || 'default';
const TRANSACTION_API = process.env.TRANSACTION_SERVICE_URL || 'default';

// ============================================================
// Stock Service (Server-side only)
// ============================================================

export async function getAllStock() {
  const res = await fetch(STOCK_API, { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch stock: ${res.statusText}` };
  }
  return res.json();
}

export async function getStockById(id: string) {
  const res = await fetch(`${STOCK_API}/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch stock item: ${res.statusText}` };
  }
  return res.json();
}

export async function createStock(productName: string, amount: number, price: number = 0) {
  const res = await fetch(STOCK_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: productName, amount, price }),
  });
  return res.json();
}

export async function updateStock(id: string, availableQuantity: number, price?: number) {
  const body: { available_quantity: number; price?: number } = { available_quantity: availableQuantity };
  if (price !== undefined) {
    body.price = price;
  }
  const res = await fetch(`${STOCK_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteStock(id: string) {
  const res = await fetch(`${STOCK_API}/${id}`, { method: 'DELETE' });
  return res.json();
}

// ============================================================
// Cart Service (Server-side only)
// ============================================================

export async function getOrCreateCart(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(CART_API, { headers, cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch cart: ${res.statusText}` };
  }
  return res.json();
}

export async function addItemToCart(
  token: string,
  productId: string,
  productName: string,
  quantity: number,
  price: number
) {
  const res = await fetch(`${CART_API}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      product_name: productName,
      quantity,
      price,
    }),
  });
  return res.json();
}

export async function updateCartItem(token: string, productName: string, quantity: number) {
  const res = await fetch(`${CART_API}/items/${encodeURIComponent(productName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
}

export async function removeCartItem(token: string, productName: string) {
  const res = await fetch(`${CART_API}/items/${encodeURIComponent(productName)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function checkoutCart(token: string) {
  const res = await fetch(`${CART_API}/checkout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function deleteCart(token: string) {
  const res = await fetch(CART_API, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

// ============================================================
// Transaction Service (Server-side only)
// ============================================================

export async function getAllTransactions() {
  const res = await fetch(TRANSACTION_API, { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch transactions: ${res.statusText}` };
  }
  return res.json();
}

export async function getTransactionById(id: string) {
  const res = await fetch(`${TRANSACTION_API}/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch transaction: ${res.statusText}` };
  }
  return res.json();
}

export async function getTransactionsByCart(cartId: string) {
  const res = await fetch(`${TRANSACTION_API}/cart/${cartId}`, { cache: 'no-store' });
  if (!res.ok) {
    return { success: false, message: `Failed to fetch transactions: ${res.statusText}` };
  }
  return res.json();
}

export async function updateTransactionStatus(id: string, status: string, cartId?: string) {
  const res = await fetch(`${TRANSACTION_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, cart_id: cartId }),
  });
  return res.json();
}
