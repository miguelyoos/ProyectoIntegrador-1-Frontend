import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../context/ActivitiesContext';
import ActivityModal from '../components/hoy/ActivityModal';
import SubtasksPanel from '../components/hoy/SubtasksPanel';
import SubtaskModal from '../components/hoy/SubtaskModal';
import ConfirmDialog from '../components/hoy/ConfirmDialog';
import './PlaceholderPage.css';

// Dashboard activity item component with expand/collapse
function DashboardActivityItem({ activity, isExpanded, onToggle, onEdit, onDelete, onAddSubtask, onEditSubtask }) {
  return (
    <li key={activity.id} className="activity-item-wrapper">
      <div className={`activity-item ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
        <div className={`priority-indicator ${activity.prioridad?.toLowerCase()}`}></div>
        <div className="activity-info">
          <span className="activity-title">{activity.titulo}</span>
          <span className="activity-meta">
            {activity.materia} • {activity.horasComp || 0}h/{activity.horasEst || 0}h
          </span>
        </div>
        <div className={`status-badge ${activity.estado}`}>
          {activity.estado === 'completada' ? '✓' : activity.estado === 'progreso' ? '↻' : '○'}
        </div>
        <div className="activity-actions">
          <button className="activity-action-btn" title="Añadir subtarea" onClick={(e) => { e.stopPropagation(); onAddSubtask(activity.id); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="activity-action-btn" title="Editar" onClick={(e) => { e.stopPropagation(); onEdit(activity.id); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="activity-action-btn delete" title="Eliminar" onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
      {isExpanded && (
        <SubtasksPanel
          activity={activity}
          open={true}
          onAddSubtask={onAddSubtask}
          onEditSubtask={onEditSubtask}
        />
      )}
    </li>
  );
}

export function DashboardPage() {
  const { activities, addActivity, updateActivity, deleteActivity, expandedCards, toggleExpand, addSubtask, updateSubtask } = useActivities();
  const navigate = useNavigate();

  // Modal state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);

  // Subtask modal state
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [subtaskActivityId, setSubtaskActivityId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingActivityId, setDeletingActivityId] = useState(null);

  // Track expanded activity in dashboard
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  function toggleActivityExpand(activityId) {
    setExpandedActivityId(expandedActivityId === activityId ? null : activityId);
  }

  // Activity edit/delete handlers
  function handleEditActivity(id) {
    setEditingActivityId(id);
    setActivityModalOpen(true);
  }

  function handleDeleteActivity(id) {
    setDeletingActivityId(id);
    setDeleteDialogOpen(true);
  }

  // Get activity being edited
  const editingActivity = editingActivityId
    ? activities.find(a => a.id === editingActivityId)
    : null;

  // Modal handlers
  function openNewActivity() { setEditingActivityId(null); setActivityModalOpen(true); }
  function closeActivityModal() { setActivityModalOpen(false); setEditingActivityId(null); }

  function handleSaveActivity(data) {
    if (editingActivityId) {
      updateActivity(editingActivityId, data);
    } else {
      addActivity(data);
    }
    closeActivityModal();
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

  // Delete handlers
  function askDelete(id) {
    setDeletingActivityId(id);
    setDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    if (deletingActivityId) {
      deleteActivity(deletingActivityId);
    }
    setDeleteDialogOpen(false);
    setDeletingActivityId(null);
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const total = activities.length;
    const pendientes = activities.filter(a => a.estado === 'pendiente').length;
    const enProgreso = activities.filter(a => a.estado === 'progreso').length;
    const completadas = activities.filter(a => a.estado === 'completada').length;

    const totalHoras = activities.reduce((sum, a) => sum + (a.horasEst || 0), 0);
    const horasCompletadas = activities.reduce((sum, a) => sum + (a.horasComp || 0), 0);
    const progresoGeneral = totalHoras > 0 ? Math.round((horasCompletadas / totalHoras) * 100) : 0;

    const totalSubtareas = activities.reduce((sum, a) => sum + (a.subtasks?.length || 0), 0);
    const subtareasCompletadas = activities.reduce((sum, a) => {
      return sum + (a.subtasks?.filter(s => s.done).length || 0);
    }, 0);

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const actividadesHoy = activities.filter(a => a.fecha === today).length;

    // Overdue count
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const vencidas = activities.filter(a => a.fecha && a.fecha < yesterdayStr && a.estado !== 'completada').length;

    return {
      total,
      pendientes,
      enProgreso,
      completadas,
      totalHoras,
      horasCompletadas,
      progresoGeneral,
      totalSubtareas,
      subtareasCompletadas,
      actividadesHoy,
      vencidas
    };
  }, [activities]);

  // Get activities grouped by date
  const groupedActivities = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const overdue = [];
    const todayActivities = [];
    const upcoming = [];
    
    activities.forEach(activity => {
      if (!activity.fecha) {
        upcoming.push(activity);
        return;
      }
      
      if (activity.fecha <= yesterdayStr && activity.estado !== 'completada') {
        overdue.push(activity);
      } else if (activity.fecha === todayStr) {
        todayActivities.push(activity);
      } else {
        upcoming.push(activity);
      }
    });
    
    // Sort each group
    const sortByDate = (a, b) => {
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(a.fecha) - new Date(b.fecha);
    };
    
    return {
      overdue: overdue.sort(sortByDate),
      today: todayActivities.sort(sortByDate),
      upcoming: upcoming.sort(sortByDate)
    };
  }, [activities]);

  const hasActivities = activities.length > 0;

  return (
    <main className="dashboard-page">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Hola 👋</h1>
          <p className="dashboard-subtitle">
            {hasActivities 
              ? `Tienes ${stats.actividadesHoy + stats.pendientes + stats.enProgreso} tareas pendientes`
              : '¡Comienza a organizar tus tareas!'
            }
          </p>
        </div>
        <button className="btn-new-task" onClick={openNewActivity}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva Tarea
        </button>
      </header>

      {/* Progress Overview Card */}
      <section className="progress-card">
        <div className="progress-header-row">
          <h2>Tu Progreso</h2>
          <span className="progress-badge">{stats.progresoGeneral}%</span>
        </div>
        
        <div className="progress-visual">
          <div className="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle className="progress-ring-bg" cx="50" cy="50" r="45" />
              <circle 
                className="progress-ring-fill" 
                cx="50" 
                cy="50" 
                r="45"
                style={{ strokeDashoffset: 283 - (283 * stats.progresoGeneral) / 100 }}
              />
            </svg>
            <div className="progress-ring-content">
              <span className="progress-value">{stats.progresoGeneral}%</span>
              <span className="progress-label">completado</span>
            </div>
          </div>
          
          <div className="progress-stats">
            <div className="progress-stat">
              <div className="stat-dot completed"></div>
              <div className="stat-info">
                <span className="stat-number">{stats.completadas}</span>
                <span className="stat-text">Completadas</span>
              </div>
            </div>
            <div className="progress-stat">
              <div className="stat-dot in-progress"></div>
              <div className="stat-info">
                <span className="stat-number">{stats.enProgreso}</span>
                <span className="stat-text">En Progreso</span>
              </div>
            </div>
            <div className="progress-stat">
              <div className="stat-dot pending"></div>
              <div className="stat-info">
                <span className="stat-number">{stats.pendientes}</span>
                <span className="stat-text">Pendientes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hours-progress">
          <div className="hours-header">
            <span>Horas de trabajo</span>
            <span>{stats.horasCompletadas}h / {stats.totalHoras}h</span>
          </div>
          <div className="hours-bar">
            <div 
              className="hours-fill" 
              style={{ width: `${stats.totalHoras > 0 ? (stats.horasCompletadas / stats.totalHoras) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="quick-stats">
        <div className="quick-stat-card highlight">
          <div className="quick-stat-icon">🎯</div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{stats.actividadesHoy}</span>
            <span className="quick-stat-label">Para hoy</span>
          </div>
        </div>
        
        <div className="quick-stat-card warning">
          <div className="quick-stat-icon">⚠️</div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{stats.vencidas}</span>
            <span className="quick-stat-label">Vencidas</span>
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-icon">📝</div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{stats.subtareasCompletadas}/{stats.totalSubtareas}</span>
            <span className="quick-stat-label">Subtareas</span>
          </div>
        </div>
      </section>

      {/* Activities by Status */}
      <section className="activities-section">
        <div className="section-header">
          <h2>Tus Actividades</h2>
          <button className="btn-see-all" onClick={() => navigate('/actividades')}>
            Ver todas
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Today's Activities */}
        {groupedActivities.today.length > 0 && (
          <div className="activity-group-card today">
            <div className="group-header">
              <span className="group-emoji">📅</span>
              <h3>Hoy</h3>
              <span className="group-count">{groupedActivities.today.length}</span>
            </div>
            <ul className="activity-list">
              {groupedActivities.today.map(activity => (
                <DashboardActivityItem
                  key={activity.id}
                  activity={activity}
                  isExpanded={expandedActivityId === activity.id}
                  onToggle={() => toggleActivityExpand(activity.id)}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                  onAddSubtask={openAddSubtask}
                  onEditSubtask={openEditSubtask}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Overdue Activities */}
        {groupedActivities.overdue.length > 0 && (
          <div className="activity-group-card overdue">
            <div className="group-header">
              <span className="group-emoji">⚠️</span>
              <h3>Vencidas</h3>
              <span className="group-count">{groupedActivities.overdue.length}</span>
            </div>
            <ul className="activity-list">
              {groupedActivities.overdue.map(activity => (
                <DashboardActivityItem
                  key={activity.id}
                  activity={activity}
                  isExpanded={expandedActivityId === activity.id}
                  onToggle={() => toggleActivityExpand(activity.id)}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                  onAddSubtask={openAddSubtask}
                  onEditSubtask={openEditSubtask}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Upcoming Activities */}
        {groupedActivities.upcoming.length > 0 && (
          <div className="activity-group-card upcoming">
            <div className="group-header">
              <span className="group-emoji">📆</span>
              <h3>Próximas</h3>
              <span className="group-count">{groupedActivities.upcoming.length}</span>
            </div>
            <ul className="activity-list">
              {groupedActivities.upcoming.slice(0, 5).map(activity => (
                <DashboardActivityItem
                  key={activity.id}
                  activity={activity}
                  isExpanded={expandedActivityId === activity.id}
                  onToggle={() => toggleActivityExpand(activity.id)}
                  onEdit={handleEditActivity}
                  onDelete={handleDeleteActivity}
                  onAddSubtask={openAddSubtask}
                  onEditSubtask={openEditSubtask}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {!hasActivities && (
          <div className="empty-state-card">
            <div className="empty-icon">✨</div>
            <h3>¡Bienvenido a tu dashboard!</h3>
            <p>No tienes ninguna actividad todavía. Crea tu primera tarea y comienza a organizar tu tiempo.</p>
            <button className="btn-primary" onClick={openNewActivity}>
              Crear primera tarea
            </button>
          </div>
        )}
      </section>

      {/* Activity Modal */}
      <ActivityModal
        open={activityModalOpen}
        editingActivity={editingActivity}
        onClose={closeActivityModal}
        onSave={handleSaveActivity}
      />

      {/* Subtask Modal */}
      <SubtaskModal
        open={subtaskModalOpen}
        activityId={subtaskActivityId}
        editingSubtaskId={editingSubtaskId}
        onClose={closeSubtaskModal}
        onSave={handleSaveSubtask}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="¿Eliminar actividad?"
        message={deletingActivityId ? `¿Eliminar la actividad? Esta acción no se puede deshacer.` : ''}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}

export function CalendarioPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-icon">📅</div>
      <h2>Calendario</h2>
      <p>Próximamente: vista de calendario con todas tus fechas de entrega.</p>
    </main>
  );
}
