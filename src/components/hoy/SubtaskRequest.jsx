import React from 'react';
import './SubtaskRequest.css';

export default function SubtaskRequest({ open, activityTitle, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="subtask-request-overlay">
      <div className="subtask-request-dialog">
        <div className="subtask-request-icon">📝</div>
        <h3 className="subtask-request-title">¿Crear subtarea?</h3>
        <p className="subtask-request-message">
          ¿Deseas agregar una subtarea a la actividad <strong>"{activityTitle}"</strong>?
        </p>
        <div className="subtask-request-buttons">
          <button className="btn-cancel" onClick={onCancel}>
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
