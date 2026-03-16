interface ProductCardProps {
  productId: string;
  productName: string;
  price: number;
  availableQuantity: number;
  onAddToCart: () => void;
  disabled?: boolean;
}

export default function ProductCard({
  productName,
  price,
  availableQuantity,
  onAddToCart,
  disabled = false
}: ProductCardProps) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px',
      backgroundColor: 'var(--surface)',
      boxShadow: '0 8px 18px rgba(74, 49, 30, 0.08)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{productName}</h3>
      <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-strong)' }}>
        ${price.toFixed(2)}
      </p>
      <p style={{ margin: '5px 0', color: availableQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
        {availableQuantity > 0 ? `In Stock: ${availableQuantity}` : 'Out of Stock'}
      </p>
      <button
        onClick={onAddToCart}
        disabled={disabled || availableQuantity <= 0}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '10px',
          backgroundColor: availableQuantity > 0 ? 'var(--primary)' : '#cfc6ba',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: availableQuantity > 0 && !disabled ? 'pointer' : 'not-allowed'
        }}
      >
        {availableQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
