import React, { useState } from 'react';
import FormField from './FormField';

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * Password field with show/hide toggle.
 * Accepts same props as FormField (minus type and rightSlot).
 */
export default function PasswordInput({ id = 'password', value, onChange, onBlur, error, placeholder = '••••••••' }) {
  const [visible, setVisible] = useState(false);

  const toggleBtn = (
    <button
      type="button"
      className="toggle-pw"
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      onClick={() => setVisible(v => !v)}
    >
      {visible ? <EyeClosed /> : <EyeOpen />}
    </button>
  );

  return (
    <FormField
      id={id}
      label="Contraseña"
      labelIcon={<LockIcon />}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete="current-password"
      error={error}
      rightSlot={toggleBtn}
    />
  );
}
