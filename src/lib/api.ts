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

type ServiceResponse = {
  success?: boolean;
  message?: string;
  [key: string]: any;
};

async function serviceRequest(url: string, options: RequestInit = {}): Promise<ServiceResponse> {
  try {
    const res = await fetch(url, { cache: 'no-store', ...options });

    let payload: ServiceResponse | null = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }

    if (!res.ok) {
      return {
        success: false,
        message: payload?.message || `Request to service failed (${res.status})`,
        status: res.status,
      };
    }

    if (!payload) {
      return { success: false, message: 'Service returned invalid JSON' };
    }

    return payload;
  } catch {
    return { success: false, message: 'Failed to connect to upstream service' };
  }
}

// ============================================================
// Stock Service (Server-side only)
// ============================================================

export async function getAllStock() {
  return serviceRequest(STOCK_API);
}

export async function getStockById(id: string) {
  return serviceRequest(`${STOCK_API}/${id}`);
}

export async function createStock(productName: string, amount: number, price: number = 0) {
  return serviceRequest(STOCK_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: productName, amount, price }),
  });
}

export async function updateStock(id: string, availableQuantity: number, price?: number) {
  const body: { available_quantity: number; price?: number } = { available_quantity: availableQuantity };
  if (price !== undefined) {
    body.price = price;
  }
  return serviceRequest(`${STOCK_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteStock(id: string) {
  return serviceRequest(`${STOCK_API}/${id}`, { method: 'DELETE' });
}

// ============================================================
// Cart Service (Server-side only)
// ============================================================

export async function getOrCreateCart(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return serviceRequest(CART_API, { headers });
}

export async function addItemToCart(
  token: string,
  productId: string,
  productName: string,
  quantity: number,
  price: number
) {
  return serviceRequest(`${CART_API}/items`, {
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
}

export async function updateCartItem(token: string, productName: string, quantity: number) {
  return serviceRequest(`${CART_API}/items/${encodeURIComponent(productName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(token: string, productName: string) {
  return serviceRequest(`${CART_API}/items/${encodeURIComponent(productName)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function checkoutCart(token: string) {
  return serviceRequest(`${CART_API}/checkout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function deleteCart(token: string) {
  return serviceRequest(CART_API, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

// ============================================================
// Transaction Service (Server-side only)
// ============================================================

export async function getAllTransactions() {
  return serviceRequest(TRANSACTION_API);
}

export async function getTransactionById(id: string) {
  return serviceRequest(`${TRANSACTION_API}/${id}`);
}

export async function getTransactionsByCart(cartId: string) {
  return serviceRequest(`${TRANSACTION_API}/cart/${cartId}`);
}

export async function updateTransactionStatus(id: string, status: string, cartId?: string) {
  return serviceRequest(`${TRANSACTION_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, cart_id: cartId }),
  });
}
