import React from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ open, message, onCancel, onConfirm, title = '¿Eliminar actividad?' }) {
  return (
    <div className={`confirm-overlay${open ? ' open' : ''}`}>
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message || 'Esta acción no se puede deshacer.'}</p>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
