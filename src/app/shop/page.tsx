'use client';

import { useState, useEffect } from 'react';
import { fetchAllStock, fetchOrCreateCart, addToCart } from '@/lib/client-api';
import { LoadingSpinner, MessageDisplay, ProductCard } from '@/components';

interface StockItem {
  product_id: string;
  product_name: string;
  available_quantity: number;
  price: number;
}

export default function ShopPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cartToken, setCartToken] = useState<string | null>(null);

  useEffect(() => {
    // Load cart token from localStorage
    const token = localStorage.getItem('cartToken');
    if (token) setCartToken(token);

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllStock();
      if (data.success) {
        setStocks(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch {
      setError('Failed to connect to stock service');
    }
    setLoading(false);
  };

  const ensureCart = async (): Promise<string | null> => {
    if (cartToken) return cartToken;

    try {
      const data = await fetchOrCreateCart();
      if (data.success && data.token) {
        localStorage.setItem('cartToken', data.token);
        setCartToken(data.token);
        return data.token;
      }
      setError((data.message as string) || 'Failed to create cart');
    } catch {
      setError('Unexpected error while creating cart');
    }
    return null;
  };

  const handleAddToCart = async (product: StockItem) => {
    setMessage('');
    setError('');

    const token = await ensureCart();
    if (!token) return;

    try {
      const result = await addToCart(
        token,
        product.product_id,
        product.product_name,
        1,
        product.price
      );

      if (result.success) {
        setMessage(`Added ${product.product_name} to cart!`);
      } else {
        setError((result.message as string) || 'Failed to add to cart');
      }
    } catch {
      setError('Unexpected error while adding item to cart');
    }
  };

  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Shop</h1>

      <MessageDisplay error={error} success={message} />

      {cartToken && <p style={{ color: 'var(--success)' }}>Cart active ✓</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {stocks.map((product) => (
          <ProductCard
            key={product.product_id}
            productId={product.product_id}
            productName={product.product_name}
            price={product.price}
            availableQuantity={product.available_quantity}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>

      {stocks.length === 0 && <p className="muted">No products available. Add some in Stock (Admin) page.</p>}
    </div>
  );
}
