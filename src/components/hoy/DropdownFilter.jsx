import React, { useState, useEffect, useRef } from 'react';
import './DropdownFilter.css';

export default function DropdownFilter({ icon, label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = React.useId();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className={`dropdown-filter${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button"
        className="filter-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label ? `${label}: ${selected.label}` : selected.label}
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
      >
        {icon}
        <span>{selected.label}</span>
        <svg className="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className="dropdown-menu" id={listboxId} role="listbox" aria-label={label || 'Filtro'}>
        {options.map(opt => (
          <button
            type="button"
            key={opt.value ?? '__all__'}
            className={`option${opt.value === value ? ' selected' : ''}`}
            role="option"
            aria-selected={opt.value === value}
            onClick={() => { onChange(opt.value); setOpen(false); buttonRef.current?.focus(); }}
          >
            {opt.dot && <span className="dot" style={{ background: opt.dot }} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
