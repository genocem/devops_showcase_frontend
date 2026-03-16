/**
 * Client-side API helper for calling Next.js API routes
 *
 * This file is used by client components ('use client') to call
 * the Next.js API routes, which then proxy to the internal services.
 *
 * Client components should ONLY use this file, never lib/api.ts directly.
 */

type ApiResponse = {
  success?: boolean;
  message?: string;
  [key: string]: any;
};

async function requestJson(url: string, options: RequestInit = {}): Promise<ApiResponse> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
      cache: options.cache || 'no-store',
    });

    let payload: ApiResponse | null = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message = payload?.message as string | undefined;
      return {
        success: false,
        message: message || `Request failed (${response.status})`,
        status: response.status,
      };
    }

    if (!payload || typeof payload !== 'object') {
      return { success: false, message: 'Invalid response format from server' };
    }

    return payload;
  } catch {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
}

// ============================================================
// Stock API (calls /api/stock routes)
// ============================================================

export async function fetchAllStock() {
  return requestJson('/api/stock');
}

export async function fetchStockById(id: string) {
  return requestJson(`/api/stock/${id}`);
}

export async function createStockItem(productName: string, amount: number, price: number = 0) {
  return requestJson('/api/stock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: productName, amount, price }),
  });
}

export async function updateStockItem(id: string, availableQuantity: number, price?: number) {
  const body: { available_quantity: number; price?: number } = { available_quantity: availableQuantity };
  if (price !== undefined) {
    body.price = price;
  }
  return requestJson(`/api/stock/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteStockItem(id: string) {
  return requestJson(`/api/stock/${id}`, { method: 'DELETE' });
}

// ============================================================
// Cart API (calls /api/cart routes)
// ============================================================

export async function fetchOrCreateCart(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return requestJson('/api/cart', { headers });
}

export async function addToCart(
  token: string,
  productId: string,
  productName: string,
  quantity: number,
  price: number
) {
  return requestJson('/api/cart/items', {
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

export async function updateCartItemQuantity(token: string, productName: string, quantity: number) {
  return requestJson(`/api/cart/items/${encodeURIComponent(productName)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(token: string, productName: string) {
  return requestJson(`/api/cart/items/${encodeURIComponent(productName)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function checkoutUserCart(token: string) {
  return requestJson('/api/cart/checkout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function deleteUserCart(token: string) {
  return requestJson('/api/cart', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

// ============================================================
// Transaction API (calls /api/transaction routes)
// ============================================================

export async function fetchAllTransactions() {
  return requestJson('/api/transaction');
}

export async function fetchTransactionById(id: string) {
  return requestJson(`/api/transaction/${id}`);
}

export async function updateTransactionStatusById(id: string, status: string, cartId?: string) {
  return requestJson(`/api/transaction/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, cart_id: cartId }),
  });
}
