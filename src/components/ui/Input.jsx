export default function Input({ label, type = 'text', value, onChange, placeholder, required = false }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
        onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
      />
    </div>
  );
}
