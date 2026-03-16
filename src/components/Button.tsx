interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--primary)', color: '#fff' },
  secondary: { backgroundColor: '#8f806f', color: '#fff' },
  danger: { backgroundColor: 'var(--danger)', color: '#fff' },
  success: { backgroundColor: 'var(--success)', color: '#fff' },
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
        padding: '9px 16px',
        border: 'none',
        borderRadius: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'transform 0.1s ease, filter 0.2s ease',
        fontWeight: 600,
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}
