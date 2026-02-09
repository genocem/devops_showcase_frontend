'use client';

import { useState, useEffect } from 'react';
import { fetchAllStock, createStockItem, updateStockItem, deleteStockItem } from '@/lib/client-api';
import { LoadingSpinner, MessageDisplay, Button } from '@/components';

interface StockItem {
  product_id: string;
  product_name: string;
  available_quantity: number;
  reserved_quantity: number;
  price: number;
}

export default function StockPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editPrice, setEditPrice] = useState(0);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStock();
      if (data.success) {
        setStocks(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch stock');
      }
    } catch (err) {
      setError('Failed to connect to stock service');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newAmount <= 0) return;

    const result = await createStockItem(newName, newAmount, newPrice);
    if (result.success || result.ok) {
      setNewName('');
      setNewAmount(0);
      setNewPrice(0);
      fetchStock();
    } else {
      setError(result.message);
    }
  };

  const handleUpdate = async (id: string) => {
    const result = await updateStockItem(id, editQuantity, editPrice);
    if (result.success) {
      setEditId(null);
      fetchStock();
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const result = await deleteStockItem(id);
    if (result.success) {
      fetchStock();
    } else {
      setError(result.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading stock..." />;

  return (
    <div>
      <h1>Stock Management (Admin)</h1>

      <MessageDisplay error={error} />

      {/* Add new stock form */}
      <form onSubmit={handleCreate} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newAmount}
          onChange={(e) => setNewAmount(Number(e.target.value))}
          style={{ marginRight: '10px', width: '100px' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
          style={{ marginRight: '10px', width: '100px' }}
          step="0.01"
          min="0"
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Stock list */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Available</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Reserved</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Price</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.product_id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{stock.product_id}</td>
              <td style={{ padding: '8px' }}>{stock.product_name}</td>
              <td style={{ padding: '8px' }}>
                {editId === stock.product_id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    style={{ width: '80px' }}
                  />
                ) : (
                  stock.available_quantity
                )}
              </td>
              <td style={{ padding: '8px' }}>{stock.reserved_quantity}</td>
              <td style={{ padding: '8px' }}>
                {editId === stock.product_id ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    style={{ width: '80px' }}
                    step="0.01"
                    min="0"
                  />
                ) : (
                  `$${stock.price.toFixed(2)}`
                )}
              </td>
              <td style={{ padding: '8px' }}>
                {editId === stock.product_id ? (
                  <>
                    <button onClick={() => handleUpdate(stock.product_id)} style={{ marginRight: '5px' }}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(stock.product_id); setEditQuantity(stock.available_quantity); setEditPrice(stock.price); }} style={{ marginRight: '5px' }}>Edit</button>
                    <button onClick={() => handleDelete(stock.product_id)} style={{ color: 'red' }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stocks.length === 0 && <p>No products in stock. Add some above!</p>}
    </div>
  );
}
