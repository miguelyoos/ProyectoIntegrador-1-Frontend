import React, { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

export default function ConfirmDialog({ open, message, onCancel, onConfirm, title = '¿Eliminar actividad?' }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    cancelButtonRef.current?.focus();

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onCancel]);

  return (
    <div className={`confirm-overlay${open ? ' open' : ''}`} onClick={onCancel}>
      <div className="confirm-box" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" onClick={e => e.stopPropagation()}>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p>{message || 'Esta acción no se puede deshacer.'}</p>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onCancel} ref={cancelButtonRef}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
