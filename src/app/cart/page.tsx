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

  // Auto-create cart if none exists
  const initializeCart = async () => {
    const token = localStorage.getItem('cartToken');
    if (token) {
      setCartToken(token);
      await fetchCart(token);
    } else {
      // No cart token - auto-create a new cart
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
          await createNewCart();
          return; // createNewCart will set loading to false
        }
      }
    } catch {
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
        setCart(data.cart);
        setError('');
      } else {
        setError(data.message || 'Failed to create cart');
      }
    } catch {
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
    if (newQuantity < 1) {
      setError('Quantity must be at least 1. Use remove to delete an item.');
      return;
    }
    setError('');
    setMessage('');

    try {
      const result = await updateCartItemQuantity(cartToken, productName, newQuantity);
      if (result.success) {
        setCart(result.cart);
        setMessage(result.message || 'Quantity updated');
      } else {
        setError(result.message || 'Failed to update quantity');
      }
    } catch {
      setError('Unexpected error while updating quantity');
    }
  };

  const handleRemove = async (productName: string) => {
    if (!cartToken) return;
    setError('');
    setMessage('');

    try {
      const result = await removeFromCart(cartToken, productName);
      if (result.success) {
        setCart(result.cart);
        setMessage(`Removed ${productName}`);
      } else {
        setError(result.message || 'Failed to remove item');
      }
    } catch {
      setError('Unexpected error while removing item');
    }
  };

  const handleCheckout = async () => {
    if (!cartToken) return;
    setError('');
    setMessage('');

    try {
      const result = await checkoutUserCart(cartToken);
      if (result.success) {
        setCart(result.cart);
        setMessage('Checkout initiated. Transaction created. Check Transactions page.');
      } else {
        setError(result.message || 'Failed to checkout cart');
      }
    } catch {
      setError('Unexpected error while checking out cart');
    }
  };

  const handleDeleteCart = async () => {
    if (!cartToken) return;
    if (!confirm('Delete your cart? A new empty cart will be created.')) return;

    setError('');
    setMessage('');

    try {
      const result = await deleteUserCart(cartToken);
      if (result.success) {
        localStorage.removeItem('cartToken');
        setCartToken(null);
        setCart(null);

        // Auto-create new cart after deletion
        await createNewCart();
        setMessage('Cart deleted. New cart created.');
      } else {
        setError(result.message || 'Failed to delete cart');
      }
    } catch {
      setError('Unexpected error while deleting cart');
    }
  };

  const handleNewCart = async () => {
    setError('');
    setMessage('');

    // Clear old cart state
    localStorage.removeItem('cartToken');
    setCartToken(null);
    setCart(null);

    setLoading(true);
    try {
      const data = await fetchOrCreateCart();
      if (data.success && data.token) {
        localStorage.setItem('cartToken', data.token);
        setCartToken(data.token);
        setCart(data.cart);
        setMessage('New cart created!');
      } else {
        setError(data.message || 'Failed to create cart');
      }
    } catch {
      setError('Failed to connect to cart service. Please try again.');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner message="Loading cart..." />;

  // Show error state with retry option if fetch/create failed
  if (!cart && error) {
    return (
      <div className="page-shell">
        <h1 className="page-title">Cart</h1>
        <MessageDisplay error={error} />
        <Button onClick={handleRetryFetch}>Retry</Button>
      </div>
    );
  }

  // Should not happen if auto-create works, but fallback UI
  if (!cartToken || !cart) {
    return (
      <div className="page-shell">
        <h1 className="page-title">Cart</h1>
        <MessageDisplay error={error} />
        <p className="muted">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <h1 className="page-title">Cart</h1>

      <MessageDisplay error={error} success={message} />

      <p>Cart ID: <code style={{ fontSize: '12px' }}>{cart.id}</code></p>
      <p>Status: <StatusBadge status={cart.status} /></p>

      {cart.items.length === 0 ? (
        <p className="muted">Your cart is empty. Go to Shop to add items.</p>
      ) : (
        <>
          <div className="table-wrapper" style={{ marginBottom: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product_id}>
                  <td>{item.product_name}</td>
                  <td>${item.price}</td>
                  <td>
                    <Button
                      onClick={() => handleUpdateQuantity(item.product_name, item.quantity - 1)}
                      disabled={cart.status !== 'active'}
                      variant="secondary"
                      style={{ padding: '4px 10px' }}
                    >-</Button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <Button
                      onClick={() => handleUpdateQuantity(item.product_name, item.quantity + 1)}
                      disabled={cart.status !== 'active'}
                      variant="secondary"
                      style={{ padding: '4px 10px' }}
                    >+</Button>
                  </td>
                  <td>${item.subtotal.toFixed(2)}</td>
                  <td>
                    <Button
                      onClick={() => handleRemove(item.product_name)}
                      disabled={cart.status !== 'active'}
                      variant="danger"
                    >Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

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
          <p className="muted">Cart is frozen - waiting for transaction completion. Check Transactions page.</p>
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
