import React, { useState } from 'react';
import { formatShortDate } from '../../utils/helpers';
import { useActivities } from '../../context/ActivitiesContext';
import ConfirmDialog from './ConfirmDialog';
import './SubtasksPanel.css';

export default function SubtasksPanel({ activity, open, onAddSubtask, onEditSubtask }) {
  const { toggleSubtask, deleteSubtask } = useActivities();
  const subs = activity.subtasks || [];
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);

  function handleDeleteClick(subtask) {
    setSubtaskToDelete(subtask);
    setDeleteConfirmOpen(true);
  }

  function handleConfirmDelete() {
    if (subtaskToDelete) {
      deleteSubtask(activity.id, subtaskToDelete.id);
    }
    setDeleteConfirmOpen(false);
    setSubtaskToDelete(null);
  }

  function handleCancelDelete() {
    setDeleteConfirmOpen(false);
    setSubtaskToDelete(null);
  }

  return (
    <>
      <div className={`subtasks-panel${open ? ' open' : ''}`}>
        <div className="subtasks-header">
          <span>Subtareas</span>
          <button className="btn-add-subtask" onClick={() => onAddSubtask(activity.id)}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva subtarea
          </button>
        </div>

        <div className="subtask-list">
          {subs.length === 0 ? (
            <div className="subtask-empty">No hay subtareas. Añade una para planificar tu trabajo.</div>
          ) : (
            subs.map(s => (
              <div key={s.id} className="subtask-row">
                <div
                  className={`subtask-check${s.done ? ' done' : ''}`}
                  onClick={() => toggleSubtask(activity.id, s.id)}
                />
                <span className={`subtask-name${s.done ? ' done' : ''}`}>{s.nombre}</span>
                <span className="subtask-meta">
                  {s.fecha && <span>📅 {formatShortDate(s.fecha)}</span>}
                  <span>⏱ {s.horas_estimadas}h</span>
                </span>
                <div className="subtask-actions">
                  <button
                    className="subtask-icon-btn"
                    title="Editar"
                    onClick={() => onEditSubtask(activity.id, s.id)}
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="subtask-icon-btn del"
                    title="Eliminar"
                    onClick={() => handleDeleteClick(s)}
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="¿Eliminar subtarea?"
        message={subtaskToDelete ? `¿Eliminar la subtarea "${subtaskToDelete.nombre}"? Esta acción no se puede deshacer.` : ''}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
