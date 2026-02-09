interface MessageDisplayProps {
  error?: string;
  success?: string;
}

export default function MessageDisplay({ error, success }: MessageDisplayProps) {
  if (!error && !success) return null;

  return (
    <div style={{ marginBottom: '15px' }}>
      {error && (
        <p style={{
          color: '#721c24',
          backgroundColor: '#f8d7da',
          padding: '10px 15px',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{
          color: '#155724',
          backgroundColor: '#d4edda',
          padding: '10px 15px',
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          {success}
        </p>
      )}
    </div>
  );
}
