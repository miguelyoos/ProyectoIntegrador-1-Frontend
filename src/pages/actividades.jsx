import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useActivities } from '../context/ActivitiesContext';
import { PRIO_ORDER } from '../utils/helpers';
import ActivityFilters from '../components/hoy/ActivityFilters';
import StatusTabs from '../components/hoy/StatusTabs';
import ActivityCard from '../components/hoy/ActivityCard';
import ActivityModal from '../components/hoy/ActivityModal';
import SubtaskModal from '../components/hoy/SubtaskModal';
import ConfirmDialog from '../components/hoy/ConfirmDialog';
import SubtaskRequest from '../components/hoy/SubtaskRequest';
import { toast } from "react-toastify";
import './actividades.css';

export default function Actividades() {
  const { activities, addActivity, updateActivity, deleteActivity, addSubtask, updateSubtask, toggleExpand, limiteDiario } = useActivities();

  // Conflict banner state
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const [resolvedVisible, setResolvedVisible] = useState(false);
  const resolvedTimer = useRef(null);
  const wasOverloaded = useRef(false);

  // Total horas estimadas de actividades de HOY no completadas
  const totalHoras = useMemo(() => {
    const t = new Date();
    const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    return activities
      .filter(a => a.estado !== 'completada' && a.fecha === todayStr)
      .reduce((sum, a) => sum + (Number(a.horasEst) || 0), 0);
  }, [activities]);

  const isOverloaded = totalHoras > limiteDiario;

  // Detectar cuando se resuelve el conflicto (SCRUM-54)
  useEffect(() => {
    if (wasOverloaded.current && !isOverloaded) {
      setConflictDismissed(false);
      setResolvedVisible(true);
      clearTimeout(resolvedTimer.current);
      resolvedTimer.current = setTimeout(() => setResolvedVisible(false), 5000);
    }
    wasOverloaded.current = isOverloaded;
  }, [isOverloaded]);

  // Resetear dismiss cuando vuelve a haber conflicto
  useEffect(() => {
    if (isOverloaded) setConflictDismissed(false);
  }, [isOverloaded]);

  // Filter state
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState(null);
  const [prioridad, setPrioridad] = useState(null);
  const [orden, setOrden] = useState('fecha-asc');
  const [status, setStatus] = useState('todas');

  // Modal state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);

  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [subtaskActivityId, setSubtaskActivityId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Subtask request state
  const [subtaskRequestOpen, setSubtaskRequestOpen] = useState(false);
  const [subtaskRequestActivity, setSubtaskRequestActivity] = useState(null);

  // Computed counts
  const counts = useMemo(() => {
    const c = { todas: 0, pendiente: 0, progreso: 0, completada: 0 };
    activities.forEach(a => { c.todas++; if (c[a.estado] !== undefined) c[a.estado]++; });
    return c;
  }, [activities]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = activities.filter(a => {
      if (status !== 'todas' && a.estado !== status) return false;
      if (tipo && a.tipo !== tipo) return false;
      if (prioridad && a.prioridad !== prioridad) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!a.titulo.toLowerCase().includes(s) && !a.materia.toLowerCase().includes(s)) return false;
      }
      return true;
    });

    list.sort((a, b) => {

  // mover completadas al final
  if (a.estado === 'completada' && b.estado !== 'completada') return 1;
  if (a.estado !== 'completada' && b.estado === 'completada') return -1;

  if (orden === 'fecha-asc') return (a.fecha || '').localeCompare(b.fecha || '');
  if (orden === 'fecha-desc') return (b.fecha || '').localeCompare(a.fecha || '');
  if (orden === 'prioridad') return (PRIO_ORDER[b.prioridad] || 0) - (PRIO_ORDER[a.prioridad] || 0);
  if (orden === 'titulo') return a.titulo.localeCompare(b.titulo);

  return 0;
});

    return list;
  }, [activities, status, tipo, prioridad, search, orden]);

  // Activity modal handlers
  function openNewActivity() { setEditingActivityId(null); setActivityModalOpen(true); }
  function openEditActivity(id) { setEditingActivityId(id); setActivityModalOpen(true); }
  function closeActivityModal() { setActivityModalOpen(false); setEditingActivityId(null); }

  async function handleSaveActivity(data) {
  try {

    if (editingActivityId) {

      await updateActivity(editingActivityId, data);

      toast.success("Actividad actualizada correctamente");

    } else {

      const newActivity = await addActivity(data);

      toast.success("Actividad guardada correctamente");

      setSubtaskRequestActivity(newActivity);
      setSubtaskRequestOpen(true);
    }

    closeActivityModal();

  } catch (error) {

    console.error(error);

    toast.error("No pudimos guardar tu progreso, intenta de nuevo");
  }
}

  // Delete handlers
  function askDelete(id) { setDeletingId(id); setConfirmOpen(true); }
  function handleConfirmDelete() {
    deleteActivity(deletingId);
    setConfirmOpen(false);
    setDeletingId(null);
  }

  // Subtask modal handlers
  function openAddSubtask(activityId) {
    setSubtaskActivityId(activityId);
    setEditingSubtaskId(null);
    setSubtaskModalOpen(true);
  }
  function openEditSubtask(activityId, subtaskId) {
    setSubtaskActivityId(activityId);
    setEditingSubtaskId(subtaskId);
    setSubtaskModalOpen(true);
  }
  function closeSubtaskModal() {
    setSubtaskModalOpen(false);
    setSubtaskActivityId(null);
    setEditingSubtaskId(null);
  }
  function handleSaveSubtask(data) {
    if (editingSubtaskId) {
      updateSubtask(subtaskActivityId, editingSubtaskId, data);
    } else {
      addSubtask(subtaskActivityId, data);
    }
    closeSubtaskModal();
  }

  // SubtaskRequest handlers
  function handleSubtaskRequestConfirm() {
    if (subtaskRequestActivity) {
      // Expand the card first, then open subtask modal
      toggleExpand(subtaskRequestActivity.id);
      openAddSubtask(subtaskRequestActivity.id);
    }
    setSubtaskRequestOpen(false);
    setSubtaskRequestActivity(null);
  }

  function handleSubtaskRequestCancel() {
    setSubtaskRequestOpen(false);
    setSubtaskRequestActivity(null);
  }

  const editingActivity = editingActivityId ? activities.find(a => a.id === editingActivityId) : null;
  const subtaskParent = subtaskActivityId ? activities.find(a => a.id === subtaskActivityId) : null;
  const editingSubtask = editingSubtaskId && subtaskParent
    ? (subtaskParent.subtasks || []).find(s => s.id === editingSubtaskId)
    : null;
  const deletingActivity = deletingId ? activities.find(a => a.id === deletingId) : null;

  return (
    <>
      <main className="page-main">
        <h2 className="section-title">Mis Actividades</h2>

        {/* SCRUM-50: Mensaje de conflicto de sobrecarga */}
        {isOverloaded && !conflictDismissed && (
          <div className="conflict-banner" role="alert">
            <span className="conflict-banner__icon">⚠️</span>
            <div className="conflict-banner__body">
              <div className="conflict-banner__title">Sobrecarga de horas detectada</div>
              <div className="conflict-banner__desc">
                Tenés <strong>{totalHoras}h</strong> estimadas en actividades activas, pero tu límite diario es <strong>{limiteDiario}h</strong>. Considerá reducir horas o completar actividades.
              </div>
            </div>
            <button className="conflict-banner__close" onClick={() => setConflictDismissed(true)} aria-label="Cerrar aviso">✕</button>
          </div>
        )}

        {/* SCRUM-54: Resultado final de resolución de conflicto */}
        {resolvedVisible && (
          <div className="conflict-banner resolved" role="status">
            <span className="conflict-banner__icon">✅</span>
            <div className="conflict-banner__body">
              <div className="conflict-banner__title">Conflicto resuelto</div>
              <div className="conflict-banner__desc">
                Tus horas activas ({totalHoras}h) ya están dentro del límite diario ({limiteDiario}h).
              </div>
            </div>
            <button className="conflict-banner__close" onClick={() => setResolvedVisible(false)} aria-label="Cerrar aviso">✕</button>
          </div>
        )}

        <ActivityFilters
          search={search}
          onSearch={setSearch}
          tipo={tipo}
          onTipo={setTipo}
          prioridad={prioridad}
          onPrioridad={setPrioridad}
          orden={orden}
          onOrden={setOrden}
        />

        <StatusTabs current={status} counts={counts} onChange={setStatus} />

        <div className="activity-list">
          {filtered.length === 0 ? (
            <div className="empty-state">No hay actividades que coincidan con los filtros</div>
          ) : (
            filtered.map(a => (
              <ActivityCard
                key={a.id}
                activity={a}
                onEdit={openEditActivity}
                onDelete={askDelete}
                onAddSubtask={openAddSubtask}
                onEditSubtask={openEditSubtask}
              />
            ))
          )}
        </div>
      </main>

      <button className="fab" title="Nueva actividad" onClick={openNewActivity}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <ActivityModal
        open={activityModalOpen}
        editingActivity={editingActivity}
        onClose={closeActivityModal}
        onSave={handleSaveActivity}
        limiteDiario={limiteDiario}
        horasActuales={totalHoras}
      />

      <SubtaskModal
        open={subtaskModalOpen}
        parentActivity={subtaskParent}
        editingSubtask={editingSubtask}
        onClose={closeSubtaskModal}
        onSave={handleSaveSubtask}
      />

      <ConfirmDialog
        open={confirmOpen}
        message={deletingActivity ? `¿Eliminar "${deletingActivity.titulo}"? Esta acción no se puede deshacer.` : ''}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); }}
        onConfirm={handleConfirmDelete}
      />

      <SubtaskRequest
        open={subtaskRequestOpen}
        activityTitle={subtaskRequestActivity?.titulo || ''}
        onConfirm={handleSubtaskRequestConfirm}
        onCancel={handleSubtaskRequestCancel}
      />
    </>
  );
}
