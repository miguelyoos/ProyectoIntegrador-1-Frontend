import React from 'react';
import './HourlyLimitConflictDialog.css';

export default function HourlyLimitConflictDialog({
  open,
  exceedingHours,
  limitHours,
  totalHours,
  onIncreaseLimit,
  onReschedule,
  onCancel
}) {
  if (!open) return null;

  const overageHours = (totalHours - limitHours).toFixed(1);

  return (
    <div className="hourly-conflict-overlay" onClick={onCancel}>
      <div className="hourly-conflict-modal" onClick={e => e.stopPropagation()}>
        <div className="hourly-conflict-icon">⏰</div>
        
        <h2 className="hourly-conflict-title">
          Límite diario excedido
        </h2>
        
        <p className="hourly-conflict-message">
          Intentas agregar <strong>{exceedingHours}h</strong> a una subtarea, pero tu límite diario es <strong>{limitHours}h</strong>.
          {totalHours > limitHours && (
            <> Con esta subtarea tendrías <strong>{totalHours}h</strong> ({overageHours}h más de lo permitido).</>
          )}
        </p>

        <div className="hourly-conflict-options">
          <button
            className="hourly-conflict-btn increase-btn"
            onClick={onIncreaseLimit}
          >
            <span className="btn-icon">📈</span>
            <span className="btn-text">
              <strong>Incrementar límite</strong>
              <small>Aumentar tu límite diario</small>
            </span>
          </button>

          <button
            className="hourly-conflict-btn reschedule-btn"
            onClick={onReschedule}
          >
            <span className="btn-icon">📅</span>
            <span className="btn-text">
              <strong>Reprogramar</strong>
              <small>Cambiar la fecha de esta subtarea</small>
            </span>
          </button>
        </div>

        <button
          className="hourly-conflict-cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
