import React from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ open, message, onCancel, onConfirm }) {
  return (
    <div className={`confirm-overlay${open ? ' open' : ''}`}>
      <div className="confirm-box">
        <h3>¿Eliminar actividad?</h3>
        <p>{message || 'Esta acción no se puede deshacer.'}</p>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
