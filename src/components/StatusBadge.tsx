interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, { backgroundColor: string; color: string }> = {
  completed: { backgroundColor: '#ddebdc', color: '#2f5b3c' },
  failed: { backgroundColor: '#f4dddb', color: '#6f2c2c' },
  pending: { backgroundColor: '#f3ead8', color: '#765b34' },
  refunded: { backgroundColor: '#e6e0f1', color: '#4d4168' },
  active: { backgroundColor: '#e8ece3', color: '#3f5b49' },
  frozen: { backgroundColor: '#ebe4da', color: '#5f5446' },
  checked_out: { backgroundColor: '#ddebdc', color: '#2f5b3c' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || { backgroundColor: '#e2e3e5', color: '#383d41' };

  return (
    <span style={{
      padding: '5px 12px',
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
