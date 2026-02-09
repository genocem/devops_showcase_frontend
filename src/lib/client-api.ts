/**
 * Client-side API helper for calling Next.js API routes
 *
 * This file is used by client components ('use client') to call
 * the Next.js API routes, which then proxy to the internal services.
 *
 * Client components should ONLY use this file, never lib/api.ts directly.
 */

// ============================================================
// Stock API (calls /api/stock routes)
// ============================================================

export async function fetchAllStock() {
  const res = await fetch('/api/stock', { cache: 'no-store' });
  return res.json();
}

export async function fetchStockById(id: string) {
  const res = await fetch(`/api/stock/${id}`, { cache: 'no-store' });
  return res.json();
}

export async function createStockItem(productName: string, amount: number, price: number = 0) {
  const res = await fetch('/api/stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: productName, amount, price }),
  });
  return res.json();
}

export async function updateStockItem(id: string, availableQuantity: number, price?: number) {
  const body: { available_quantity: number; price?: number } = { available_quantity: availableQuantity };
  if (price !== undefined) {
    body.price = price;
  }
  const res = await fetch(`/api/stock/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteStockItem(id: string) {
  const res = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
  return res.json();
}

// ============================================================
// Cart API (calls /api/cart routes)
// ============================================================

export async function fetchOrCreateCart(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch('/api/cart', { headers, cache: 'no-store' });
  return res.json();
}

export async function addToCart(
  token: string,
  productId: string,
  productName: string,
  quantity: number,
  price: number
) {
  const res = await fetch('/api/cart/items', {
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

export async function updateCartItemQuantity(token: string, productName: string, quantity: number) {
  const res = await fetch(`/api/cart/items/${encodeURIComponent(productName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
}

export async function removeFromCart(token: string, productName: string) {
  const res = await fetch(`/api/cart/items/${encodeURIComponent(productName)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function checkoutUserCart(token: string) {
  const res = await fetch('/api/cart/checkout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

export async function deleteUserCart(token: string) {
  const res = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}

// ============================================================
// Transaction API (calls /api/transaction routes)
// ============================================================

export async function fetchAllTransactions() {
  const res = await fetch('/api/transaction', { cache: 'no-store' });
  return res.json();
}

export async function fetchTransactionById(id: string) {
  const res = await fetch(`/api/transaction/${id}`, { cache: 'no-store' });
  return res.json();
}

export async function updateTransactionStatusById(id: string, status: string, cartId?: string) {
  const res = await fetch(`/api/transaction/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, cart_id: cartId }),
  });
  return res.json();
}
