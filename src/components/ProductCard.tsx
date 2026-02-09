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
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{productName}</h3>
      <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
        ${price.toFixed(2)}
      </p>
      <p style={{ margin: '5px 0', color: availableQuantity > 0 ? '#28a745' : '#dc3545' }}>
        {availableQuantity > 0 ? `In Stock: ${availableQuantity}` : 'Out of Stock'}
      </p>
      <button
        onClick={onAddToCart}
        disabled={disabled || availableQuantity <= 0}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '10px',
          backgroundColor: availableQuantity > 0 ? '#0066cc' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: availableQuantity > 0 && !disabled ? 'pointer' : 'not-allowed'
        }}
      >
        {availableQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
