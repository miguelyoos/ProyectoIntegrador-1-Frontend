export default function EmptyState({ mensaje }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p style={{ color: '#6b7280', fontSize: '1.125rem', margin: 0 }}>{mensaje}</p>
    </div>
  );
}
