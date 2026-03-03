import React from 'react';
import { PRIO_COLORS, formatDate } from '../../utils/helpers';
import { useActivities } from '../../context/ActivitiesContext';
import SubtasksPanel from './SubtasksPanel';
import './ActivityCard.css';

const ESTADO_ICON = { completada: '✅', progreso: '🔄', pendiente: '⏳' };

export default function ActivityCard({ activity, onEdit, onDelete, onAddSubtask, onEditSubtask }) {
  const { expandedCards, toggleExpand } = useActivities();
  const isExpanded = expandedCards.has(activity.id);

  const color = PRIO_COLORS[activity.prioridad] || '#888';
  const prioClass = 'badge badge-' + activity.prioridad.toLowerCase();
  const pct = activity.horasEst > 0
    ? Math.min(100, Math.round((activity.horasComp / activity.horasEst) * 100))
    : 0;
  const subs = activity.subtasks || [];
  const subDone = subs.filter(s => s.done).length;

  return (
    <div className="activity-card-wrapper">
      <div className="activity-card">
        <div className="card-color-bar" style={{ background: color }} />

        <div className="card-info">
          <div className="card-title">{activity.titulo}</div>
          <div className="card-meta">
            <span className="badge badge-tipo">{activity.tipo}</span>
            <span className={prioClass}>{activity.prioridad}</span>
            <span>📚 {activity.materia}</span>
            {activity.fecha && <span>📅 {formatDate(activity.fecha)}</span>}
            <span>⏱ {activity.horasComp}/{activity.horasEst}h {ESTADO_ICON[activity.estado]}</span>
            <span className={`subtask-chip${subs.length > 0 ? ' has' : ''}`}>
              📋 {subs.length > 0 ? `${subDone}/${subs.length} subtareas` : 'Sin subtareas'}
            </span>
          </div>
          {activity.horasEst > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            className={`card-expand-btn${isExpanded ? ' active' : ''}`}
            title="Subtareas"
            onClick={() => toggleExpand(activity.id)}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <button className="icon-btn edit" title="Editar" onClick={() => onEdit(activity.id)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button className="icon-btn delete" title="Eliminar" onClick={() => onDelete(activity.id)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>

      <SubtasksPanel
        activity={activity}
        open={isExpanded}
        onAddSubtask={onAddSubtask}
        onEditSubtask={onEditSubtask}
      />
    </div>
  );
}
