'use client';

import { useState, useEffect } from 'react';
import {
  fetchOrCreateCart,
  updateCartItemQuantity,
  removeFromCart,
  checkoutUserCart,
  deleteUserCart
} from '@/lib/client-api';
import { LoadingSpinner, MessageDisplay, StatusBadge, Button } from '@/components';

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [hasTokenInStorage, setHasTokenInStorage] = useState(false);

  // Auto-create cart if none exists
  const initializeCart = async () => {
    const token = localStorage.getItem('cartToken');
    if (token) {
      setCartToken(token);
      setHasTokenInStorage(true);
      await fetchCart(token);
    } else {
      // No cart token - auto-create a new cart
      setHasTokenInStorage(false);
      await createNewCart();
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  const fetchCart = async (token: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrCreateCart(token);
      if (data.success) {
        setCart(data.cart);
        setError('');
        if (data.token && data.token !== token) {
          // New cart was created (old one was checked out or not found)
          localStorage.setItem('cartToken', data.token);
          setCartToken(data.token);
        }
      } else {
        setError(data.message || 'Failed to fetch cart');
        // If cart not found with this token, auto-create a new one
        if (data.error === 'NOT_FOUND') {
          localStorage.removeItem('cartToken');
          setCartToken(null);
          setHasTokenInStorage(false);
          await createNewCart();
          return; // createNewCart will set loading to false
        }
      }
    } catch (err) {
      setError('Failed to connect to cart service. Please try again.');
    }
    setLoading(false);
  };

  const createNewCart = async () => {
    setLoading(true);
    try {
      const data = await fetchOrCreateCart();
      if (data.success && data.token) {
        localStorage.setItem('cartToken', data.token);
        setCartToken(data.token);
        setHasTokenInStorage(true);
        setCart(data.cart);
        setError('');
      } else {
        setError(data.message || 'Failed to create cart');
      }
    } catch (err) {
      setError('Failed to connect to cart service. Please try again.');
    }
    setLoading(false);
  };

  const handleRetryFetch = () => {
    const token = localStorage.getItem('cartToken');
    if (token) {
      fetchCart(token);
    } else {
      createNewCart();
    }
  };

  const handleUpdateQuantity = async (productName: string, newQuantity: number) => {
    if (!cartToken) return;
    setError('');
    setMessage('');

    const result = await updateCartItemQuantity(cartToken, productName, newQuantity);
    if (result.success) {
      setCart(result.cart);
      setMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleRemove = async (productName: string) => {
    if (!cartToken) return;
    setError('');
    setMessage('');

    const result = await removeFromCart(cartToken, productName);
    if (result.success) {
      setCart(result.cart);
      setMessage(`Removed ${productName}`);
    } else {
      setError(result.message);
    }
  };

  const handleCheckout = async () => {
    if (!cartToken) return;
    setError('');
    setMessage('');

    const result = await checkoutUserCart(cartToken);
    if (result.success) {
      setCart(result.cart);
      setMessage('Checkout initiated! Transaction created. Check Transactions page.');
    } else {
      setError(result.message);
    }
  };

  const handleDeleteCart = async () => {
    if (!cartToken) return;
    if (!confirm('Delete your cart? A new empty cart will be created.')) return;

    setError('');
    setMessage('');

    const result = await deleteUserCart(cartToken);
    if (result.success) {
      localStorage.removeItem('cartToken');
      setCartToken(null);
      setCart(null);
      setHasTokenInStorage(false);

      // Auto-create new cart after deletion
      await createNewCart();
      setMessage('Cart deleted. New cart created.');
    } else {
      setError(result.message);
    }
  };

  const handleNewCart = async () => {
    setError('');
    setMessage('');

    // Clear old cart state
    localStorage.removeItem('cartToken');
    setCartToken(null);
    setCart(null);
    setHasTokenInStorage(false);

    setLoading(true);
    try {
      const data = await fetchOrCreateCart();
      if (data.success && data.token) {
        localStorage.setItem('cartToken', data.token);
        setCartToken(data.token);
        setHasTokenInStorage(true);
        setCart(data.cart);
        setMessage('New cart created!');
      } else {
        setError(data.message || 'Failed to create cart');
      }
    } catch (err) {
      setError('Failed to connect to cart service. Please try again.');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner message="Loading cart..." />;

  // Show error state with retry option if fetch/create failed
  if (!cart && error) {
    return (
      <div>
        <h1>Cart</h1>
        <MessageDisplay error={error} />
        <Button onClick={handleRetryFetch}>Retry</Button>
      </div>
    );
  }

  // Should not happen if auto-create works, but fallback UI
  if (!cartToken || !cart) {
    return (
      <div>
        <h1>Cart</h1>
        <MessageDisplay error={error} />
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart</h1>

      <MessageDisplay error={error} success={message} />

      <p>Cart ID: <code style={{ fontSize: '12px' }}>{cart.id}</code></p>
      <p>Status: <StatusBadge status={cart.status} /></p>

      {cart.items.length === 0 ? (
        <p>Your cart is empty. Go to Shop to add items!</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Quantity</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Subtotal</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item.product_name}</td>
                  <td style={{ padding: '8px' }}>${item.price}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_name, item.quantity - 1)}
                      disabled={cart.status !== 'active'}
                    >-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_name, item.quantity + 1)}
                      disabled={cart.status !== 'active'}
                    >+</button>
                  </td>
                  <td style={{ padding: '8px' }}>${item.subtotal.toFixed(2)}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => handleRemove(item.product_name)}
                      disabled={cart.status !== 'active'}
                      style={{ color: 'red' }}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ${cart.total.toFixed(2)}</h3>
        </>
      )}

      <div style={{ marginTop: '20px' }}>
        {cart.status === 'active' && cart.items.length > 0 && (
          <Button onClick={handleCheckout} variant="success" style={{ marginRight: '10px', padding: '10px 20px' }}>
            Checkout
          </Button>
        )}
        {cart.status === 'frozen' && (
          <p>Cart is frozen - waiting for transaction completion. Check Transactions page.</p>
        )}
        {cart.status === 'checked_out' && (
          <>
            <p>This cart has been checked out!</p>
            <Button onClick={handleNewCart}>Start New Cart</Button>
          </>
        )}
        <Button onClick={handleDeleteCart} variant="danger" style={{ marginLeft: '10px' }}>
          Delete Cart
        </Button>
      </div>
    </div>
  );
}
