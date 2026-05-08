import React from 'react';
import { PRIO_COLORS, formatDate } from '../../utils/helpers';
import { useActivities } from '../../context/ActivitiesContext';
import SubtasksPanel from './SubtasksPanel';
import { toast } from "react-toastify";
import './ActivityCard.css';

const ESTADO_ICON = {
  completada: '✅',
  progreso: '🔄',
  pendiente: '⏳'
};

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  onAddSubtask,
  onEditSubtask
}) {

  const {
  expandedCards,
  toggleExpand,
  updateActivity
} = useActivities();
  const isExpanded = expandedCards.has(activity.id);

  const color = PRIO_COLORS[activity.prioridad] || '#888';

  const prioClass =
    'badge badge-' + (activity.prioridad || "").toLowerCase();

  const pct = activity.horasEst > 0
    ? Math.min(
        100,
        Math.round((activity.horasComp / activity.horasEst) * 100)
      )
    : 0;

  const progressColor =
    pct >= 100
      ? "#22c55e"
      : pct >= 50
      ? "#eab308"
      : "#ef4444";

  const subs = activity.subtasks || [];
  const subDone = subs.filter(s => s.done).length;
  const [showUpdate, setShowUpdate] = React.useState(false);

  const [nuevoEstado, setNuevoEstado] = React.useState(activity.estado);

  const [desc, setDesc] = React.useState(activity.desc || "");
  async function handleUpdate() {
  try {

    await updateActivity(activity.id, {
      ...activity,
      estado: nuevoEstado,
      desc: desc,
    });

    toast.success("Actividad actualizada correctamente");

    setShowUpdate(false);

  } catch (error) {

    console.error(error);

    toast.error("Error al actualizar la actividad");

  }
}

  return (
  <>
    <div
      className={`activity-card-wrapper ${
        activity.estado === "completada"
          ? "completed-card"
          : ""
      }`}
    >
      <div className="activity-card">

        <div
          className="card-color-bar"
          style={{ background: progressColor }}
        />

        <div className="card-info">

          <div className="card-title">
            {activity.titulo}
          </div>

          <div className="card-meta">

            <span className="badge badge-tipo">
              {activity.tipo}
            </span>

            <span className={prioClass}>
              {activity.prioridad}
            </span>

            <span>
              📚 {activity.materia}
            </span>

            {activity.fecha && (
              <span>
                📅 {formatDate(activity.fecha)}
              </span>
            )}

            <span>
              ⏱ {activity.horasComp}/{activity.horasEst}h{" "}
              {ESTADO_ICON[activity.estado]}
            </span>

            <span
              className={`subtask-chip ${
                subs.length > 0 ? 'has' : ''
              }`}
            >
              📋 {subs.length > 0
                ? `${subDone}/${subs.length} subtareas`
                : 'Sin subtareas'}
            </span>

          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background: progressColor,
              }}
            />
          </div>

        </div>

        <div className="card-actions">

          <button
            className="icon-btn"
            onClick={() => setShowUpdate(!showUpdate)}
          >
            📝
          </button>

          <button
            className={`card-expand-btn ${
              isExpanded ? 'active' : ''
            }`}
            title="Subtareas"
            onClick={() => toggleExpand(activity.id)}
          >
            ▼
          </button>

          <button
            className="icon-btn edit"
            onClick={() => onEdit(activity.id)}
          >
            ✏️
          </button>

          <button
            className="icon-btn delete"
            onClick={() => onDelete(activity.id)}
          >
            🗑️
          </button>

        </div>

      </div>

      {showUpdate && (
        <div className="update-panel">

          <select
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>

          <textarea
            placeholder="Escribe una nota..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button onClick={handleUpdate}>
            Guardar
          </button>

        </div>
      )}

    </div>

    <SubtasksPanel
      activity={activity}
      open={isExpanded}
      onAddSubtask={onAddSubtask}
      onEditSubtask={onEditSubtask}
    />
  </>
)};