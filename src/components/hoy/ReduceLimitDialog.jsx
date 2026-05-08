import React from 'react';
import './ReduceLimitDialog.css';

export default function ReduceLimitDialog({
  open,
  currentLimit,
  newLimit,
  totalHoursScheduled,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  const hasConflict = totalHoursScheduled >= currentLimit;

  return (
    <div className="reduce-limit-overlay" onClick={onCancel}>
      <div className="reduce-limit-modal" onClick={e => e.stopPropagation()}>
        <div className="reduce-limit-icon">
          {hasConflict ? '⚠️' : '✓'}
        </div>
        
        <h2 className="reduce-limit-title">
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
