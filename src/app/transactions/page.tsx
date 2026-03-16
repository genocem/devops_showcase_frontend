'use client';

import { useState, useEffect } from 'react';
import { fetchAllTransactions, updateTransactionStatusById } from '@/lib/client-api';
import { LoadingSpinner, MessageDisplay, StatusBadge, Button } from '@/components';

interface Transaction {
  id: string;
  cart_id: string;
  transaction_value: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllTransactions();
      if (data.success) {
        setTransactions(data.transactions || []);
      } else {
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch {
      setError('Failed to connect to transaction service');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (txId: string, cartId: string, newStatus: string) => {
    setError('');
    setMessage('');

    try {
      const result = await updateTransactionStatusById(txId, newStatus, cartId);
      if (result.success) {
        setMessage(`Transaction ${txId} updated to ${newStatus}`);
        fetchTransactions();
      } else {
        setError(result.message || 'Failed to update transaction');
      }
    } catch {
      setError('Unexpected error while updating transaction');
    }
  };

  if (loading) return <LoadingSpinner message="Loading transactions..." />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Transactions</h1>

      <MessageDisplay error={error} success={message} />

      <Button onClick={fetchTransactions} style={{ marginBottom: '20px' }}>Refresh</Button>

      {transactions.length === 0 ? (
        <p className="muted">No transactions yet. Checkout a cart to create one.</p>
      ) : (
        <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cart ID</th>
              <th>Value</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ fontSize: '12px' }}>{tx.id}</td>
                <td style={{ fontSize: '12px' }}>{tx.cart_id}</td>
                <td>${tx.transaction_value.toFixed(2)} {tx.currency}</td>
                <td>
                  <StatusBadge status={tx.status} />
                </td>
                <td style={{ fontSize: '12px' }}>
                  {new Date(tx.created_at).toLocaleString()}
                </td>
                <td>
                  {tx.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(tx.id, tx.cart_id, 'completed')}
                        variant="success"
                        style={{ marginRight: '5px' }}
                      >
                        Complete
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(tx.id, tx.cart_id, 'failed')}
                        variant="danger"
                      >
                        Fail
                      </Button>
                    </>
                  )}
                  {tx.status === 'completed' && (
                    <Button
                      onClick={() => handleStatusUpdate(tx.id, tx.cart_id, 'refunded')}
                      variant="secondary"
                    >
                      Refund
                    </Button>
                  )}
                  {(tx.status === 'failed' || tx.status === 'refunded') && (
                    <span className="muted">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <h3>Status Flow</h3>
        <ul>
          <li><strong>pending</strong> → Transaction created, waiting for payment</li>
          <li><strong>completed</strong> → Payment successful, cart marked as checked_out, stock finalized</li>
          <li><strong>failed</strong> → Payment failed, cart unfrozen, stock unreserved</li>
          <li><strong>refunded</strong> → Refund processed</li>
        </ul>
      </div>
    </div>
  );
}
