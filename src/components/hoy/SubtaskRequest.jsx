import React, { useEffect, useRef } from 'react';
import './SubtaskRequest.css';

export default function SubtaskRequest({ open, activityTitle, onConfirm, onCancel }) {
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

  if (!open) return null;

  return (
    <div className="subtask-request-overlay" onClick={onCancel}>
      <div className="subtask-request-dialog" role="dialog" aria-modal="true" aria-labelledby="subtask-request-title" onClick={e => e.stopPropagation()}>
        <div className="subtask-request-icon">📝</div>
        <h3 className="subtask-request-title" id="subtask-request-title">¿Crear subtarea?</h3>
        <p className="subtask-request-message">
          ¿Deseas agregar una subtarea a la actividad <strong>"{activityTitle}"</strong>?
        </p>
        <div className="subtask-request-buttons">
          <button className="btn-cancel" onClick={onCancel} ref={cancelButtonRef}>
            No, gracias
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Sí, crear subtarea
          </button>
        </div>
      </div>
    </div>
  );
}
