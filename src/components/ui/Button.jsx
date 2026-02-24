export default function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth = false }) {
  const styles = {
    primary: { background: '#2563eb', color: 'white' },
    secondary: { background: '#6b7280', color: 'white' },
    danger: { background: '#dc2626', color: 'white' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
  );
}
