interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: '#0066cc', color: '#fff' },
  secondary: { backgroundColor: '#6c757d', color: '#fff' },
  danger: { backgroundColor: '#dc3545', color: '#fff' },
  success: { backgroundColor: '#28a745', color: '#fff' },
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  style = {}
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}
