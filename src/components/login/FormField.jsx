import React from 'react';
import './FormField.css';

const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/**
 * Generic form field with label, icon, input and error hint.
 *
 * Props:
 *  - id          string
 *  - label       string
 *  - labelIcon   ReactNode   (svg)
 *  - type        string      (email | text | password)
 *  - value       string
 *  - onChange    fn
 *  - onBlur      fn
 *  - placeholder string
 *  - error       string | null
 *  - autoComplete string
 *  - rightSlot   ReactNode   (optional — used by PasswordInput for the toggle button)
 */
export default function FormField({
  id,
  label,
  labelIcon,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete,
  rightSlot,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {labelIcon}
        {label}
      </label>

      <div className="input-wrap">
        <span className="input-icon">{labelIcon}</span>

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck="false"
          className={`${error ? 'error' : ''}${rightSlot ? ' has-toggle' : ''}`}
        />

        {rightSlot}
      </div>

      <span className={`field-hint${error ? ' show' : ''}`}>
        {error && <AlertIcon />}
        <span>{error}</span>
      </span>
    </div>
  );
}
