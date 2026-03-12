import React, { useState, useMemo } from 'react';
import { useActivities } from '../context/ActivitiesContext';
import { PRIO_ORDER } from '../utils/helpers';
import ActivityFilters from '../components/hoy/ActivityFilters';
import StatusTabs from '../components/hoy/StatusTabs';
import ActivityCard from '../components/hoy/ActivityCard';
import ActivityModal from '../components/hoy/ActivityModal';
import SubtaskModal from '../components/hoy/SubtaskModal';
import ConfirmDialog from '../components/hoy/ConfirmDialog';
import './actividades.css';

export default function Hoy() {
  const { activities, addActivity, updateActivity, deleteActivity, addSubtask, updateSubtask } = useActivities();
  
  
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

  function handleSaveActivity(data) {
    if (editingActivityId) {
      updateActivity(editingActivityId, data).catch(err => {
        alert('Error al actualizar la actividad. Revisa la consola para más detalles.');
      });
    } else {
      addActivity(data);
    }
    closeActivityModal();
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
    </>
  );
}
