import React, { useEffect, useRef } from 'react';
import './ReduceLimitDialog.css';

export default function ReduceLimitDialog({
  open,
  currentLimit,
  newLimit,
  totalHoursScheduled,
  onConfirm,
  onCancel
}) {
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

  const hasConflict = totalHoursScheduled >= currentLimit;

  return (
    <div className="reduce-limit-overlay" onClick={onCancel}>
      <div className="reduce-limit-modal" role="dialog" aria-modal="true" aria-labelledby="reduce-limit-title" onClick={e => e.stopPropagation()}>
        <div className="reduce-limit-icon">
          {hasConflict ? '⚠️' : '✓'}
        </div>
        
        <h2 className="reduce-limit-title" id="reduce-limit-title">
          {hasConflict ? 'Conflicto detectado' : 'Reducir límite diario'}
        </h2>
        
        {hasConflict ? (
          <p className="reduce-limit-message warning">
            No puedes reducir el límite a <strong>{newLimit}h</strong> porque ya tienes 
            <strong> {totalHoursScheduled}h</strong> de subtareas programadas.
            <br />
            <br />
            <small>Completa o reprograma subtareas antes de reducir el límite.</small>
          </p>
        ) : (
          <p className="reduce-limit-message">
            Tu límite diario se reducirá de <strong>{currentLimit}h</strong> a <strong>{newLimit}h</strong>.
            <br />
            Actualmente tienes <strong>{totalHoursScheduled}h</strong> programadas, así que esto está permitido.
          </p>
        )}

        <div className="reduce-limit-actions">
          <button
            className="reduce-limit-cancel-btn"
            onClick={onCancel}
            ref={cancelButtonRef}
          >
            Cancelar
          </button>
          {!hasConflict && (
            <button
              className="reduce-limit-confirm-btn"
              onClick={onConfirm}
            >
              Confirmar reducción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
