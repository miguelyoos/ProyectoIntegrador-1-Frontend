import React, { useState, useEffect, useRef } from 'react';
import './DropdownFilter.css';

export default function DropdownFilter({ icon, label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className={`dropdown-filter${open ? ' open' : ''}`} ref={ref}>
      <div className="filter-btn" onClick={() => setOpen(o => !o)}>
        {icon}
        <span>{selected.label}</span>
        <svg className="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="dropdown-menu">
        {options.map(opt => (
          <div
            key={opt.value ?? '__all__'}
            className={`option${opt.value === value ? ' selected' : ''}`}
            onClick={() => { onChange(opt.value); setOpen(false); }}
          >
            {opt.dot && <span className="dot" style={{ background: opt.dot }} />}
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
