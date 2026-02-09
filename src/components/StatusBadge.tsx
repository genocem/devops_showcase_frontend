interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
  completed: { backgroundColor: '#d4edda', color: '#155724' },
  failed: { backgroundColor: '#f8d7da', color: '#721c24' },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  refunded: { backgroundColor: '#cce5ff', color: '#004085' },
  active: { backgroundColor: '#d1ecf1', color: '#0c5460' },
  frozen: { backgroundColor: '#e2e3e5', color: '#383d41' },
  checked_out: { backgroundColor: '#d4edda', color: '#155724' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || { backgroundColor: '#e2e3e5', color: '#383d41' };

  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      ...style
    }}>
      {status}
    </span>
  );
}
