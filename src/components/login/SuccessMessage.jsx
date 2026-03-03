import React from 'react';
import './SuccessMessage.css';

export default function SuccessMessage() {
  return (
    <div className="success-msg">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2>¡Listo, estás dentro!</h2>
      <p>Redirigiendo a tu espacio de trabajo…</p>
    </div>
  );
}
