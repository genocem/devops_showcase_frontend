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
    setError('');
    try {
      const data = await fetchAllStock();
      if (data.success) {
        setStocks(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch stock');
      }
    } catch {
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
    setError('');

    try {
      const result = await createStockItem(newName, newAmount, newPrice);
      if (result.success || result.ok) {
        setNewName('');
        setNewAmount(0);
        setNewPrice(0);
        fetchStock();
      } else {
        setError((result.message as string) || 'Failed to create product');
      }
    } catch {
      setError('Unexpected error while creating product');
    }
  };

  const handleUpdate = async (id: string) => {
    setError('');
    try {
      const result = await updateStockItem(id, editQuantity, editPrice);
      if (result.success) {
        setEditId(null);
        fetchStock();
      } else {
        setError((result.message as string) || 'Failed to update product');
      }
    } catch {
      setError('Unexpected error while updating product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setError('');
    try {
      const result = await deleteStockItem(id);
      if (result.success) {
        fetchStock();
      } else {
        setError((result.message as string) || 'Failed to delete product');
      }
    } catch {
      setError('Unexpected error while deleting product');
    }
  };

  if (loading) return <LoadingSpinner message="Loading stock..." />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Stock Management (Admin)</h1>

      <MessageDisplay error={error} />

      {/* Add new stock form */}
      <form onSubmit={handleCreate} style={{ marginBottom: '20px', padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface-soft)' }}>
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
        <Button type="submit">Add Product</Button>
      </form>

      {/* Stock list */}
      <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Available</th>
            <th>Reserved</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.product_id}>
              <td>{stock.product_id}</td>
              <td>{stock.product_name}</td>
              <td>
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
              <td>{stock.reserved_quantity}</td>
              <td>
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
              <td>
                {editId === stock.product_id ? (
                  <>
                    <Button onClick={() => handleUpdate(stock.product_id)} style={{ marginRight: '5px' }}>Save</Button>
                    <Button onClick={() => setEditId(null)} variant="secondary">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => { setEditId(stock.product_id); setEditQuantity(stock.available_quantity); setEditPrice(stock.price); }} style={{ marginRight: '5px' }}>Edit</Button>
                    <Button onClick={() => handleDelete(stock.product_id)} variant="danger">Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {stocks.length === 0 && <p className="muted">No products in stock. Add some above.</p>}
    </div>
  );
}
