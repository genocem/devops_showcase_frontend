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
          color: '#6f2c2c',
          backgroundColor: '#f6e1df',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '1px solid #e3bdb7',
          margin: 0
        }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{
          color: '#2f5b3c',
          backgroundColor: '#dfecdf',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '1px solid #b8d4bf',
          margin: 0
        }}>
          {success}
        </p>
      )}
    </div>
  );
}
