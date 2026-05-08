import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../context/ActivitiesContext';
import { formatShortDate } from '../utils/helpers';
import ActivityModal from '../components/hoy/ActivityModal';
import SubtaskModal from '../components/hoy/SubtaskModal';
import SubtaskRequest from '../components/hoy/SubtaskRequest';
import ConfirmDialog from '../components/hoy/ConfirmDialog';
import './PlaceholderPage.css';

// Dashboard compact subtask item
function DashboardSubtaskItem({ subtask, parentActivity, onAddSubtask, onEditSubtask, onDeleteSubtask }) {
  return (
    <div className="compact-subtask-item">
      <div className="compact-subtask-header">
        <span className="compact-subtask-name">{subtask.nombre}</span>
        <div className="compact-subtask-actions">
          <button 
            className="compact-subtask-btn" 
            title="Editar subtarea"
            onClick={() => onEditSubtask(parentActivity.id, subtask.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>
          <button 
            className="compact-subtask-btn add" 
            title="Añadir subtarea"
            onClick={() => onAddSubtask(parentActivity.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button 
            className="compact-subtask-btn delete" 
            title="Eliminar subtarea"
            onClick={() => onDeleteSubtask(parentActivity.id, subtask.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="compact-subtask-meta">
        <span className="compact-subtask-parent">de: {parentActivity.titulo}</span>
        {subtask.fecha_entrega && (
          <span className="compact-subtask-date">📅 {formatShortDate(subtask.fecha_entrega)}</span>
        )}
      </div>
    </div>
  );
}

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
            {activity.fecha && <span className="activity-date"> • 📅 {activity.fecha}</span>}
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
        <div className="compact-subtasks">
          {(activity.subtasks || []).length === 0 ? (
            <div className="compact-subtask-empty">No hay subtareas</div>
          ) : (
            (activity.subtasks || []).map(sub => (
              <DashboardSubtaskItem key={sub.id} subtask={sub} parentActivity={activity} />
            ))
          )}
        </div>
      )}
    </li>
  );
}

export function DashboardPage() {
  const { activities, addActivity, updateActivity, deleteActivity, addSubtask, updateSubtask, deleteSubtask, limiteDiario, actualizarLimite } = useActivities();
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

  // Subtask delete dialog state
  const [deleteSubtaskDialogOpen, setDeleteSubtaskDialogOpen] = useState(false);
  const [deletingSubtask, setDeletingSubtask] = useState(null);

// Subtask request dialog state
  const [subtaskRequestOpen, setSubtaskRequestOpen] = useState(false);
  const [subtaskRequestActivity, setSubtaskRequestActivity] = useState(null);

  // Daily limit modal state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState(limiteDiario);
  const [limitError, setLimitError] = useState('');

  // Conflict banner state
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const [resolvedVisible, setResolvedVisible] = useState(false);
  const resolvedTimer = useRef(null);
  const wasOverloaded = useRef(false);

  const totalHorasActivas = useMemo(() => {
    const t = new Date();
    const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    return activities
      .filter(a => a.estado !== 'completada' && a.fecha === todayStr)
      .reduce((sum, a) => sum + (Number(a.horasEst) || 0), 0);
  }, [activities]);
  const isOverloaded = totalHorasActivas > limiteDiario;

  useEffect(() => {
    if (wasOverloaded.current && !isOverloaded) {
      setConflictDismissed(false);
      setResolvedVisible(true);
      clearTimeout(resolvedTimer.current);
      resolvedTimer.current = setTimeout(() => setResolvedVisible(false), 5000);
    }
    wasOverloaded.current = isOverloaded;
  }, [isOverloaded]);

  useEffect(() => {
    if (isOverloaded) setConflictDismissed(false);
  }, [isOverloaded]);

  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Track expanded activity in dashboard
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState({
    today: false,
    overdue: false,
    upcoming: false
  });

  function toggleSection(section) {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

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

  function handleDeleteSubtask(activityId, subtaskId) {
    setDeletingSubtask({ activityId, subtaskId });
    setDeleteSubtaskDialogOpen(true);
  }

  function handleConfirmDeleteSubtask() {
    if (deletingSubtask) {
      deleteSubtask(deletingSubtask.activityId, deletingSubtask.subtaskId);
    }
    setDeleteSubtaskDialogOpen(false);
    setDeletingSubtask(null);
  }

  function handleCancelDeleteSubtask() {
    setDeleteSubtaskDialogOpen(false);
    setDeletingSubtask(null);
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
      // Show success message for date changes
      setSuccessMessage('Fecha Cambiada Exitosamente');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } else {
      addActivity(data).then((newActivity) => {
        // Show subtask request dialog for new activities
        setSubtaskRequestActivity(newActivity);
        setSubtaskRequestOpen(true);
      });
    }
    closeActivityModal();
  }

  // Daily limit modal handlers
  function handleOpenLimitModal() {
    setNewLimit(limiteDiario);
    setLimitError('');
    setShowLimitModal(true);
  }

  function handleSaveLimit() {
    const limitNum = Number(newLimit);
    if (isNaN(limitNum)) {
      setLimitError('Ingresa un número válido');
      return;
    }
    if (limitNum < 1) {
      setLimitError('El mínimo es 1 hora');
      return;
    }
    if (limitNum > 16) {
      setLimitError('El máximo es 16 horas');
      return;
    }
    
    actualizarLimite(limitNum).then(() => {
      setShowLimitModal(false);
      setSuccessMessage('Límite actualizado exitosamente');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    }).catch(() => {
      setLimitError('Error al actualizar el límite');
    });
  }

  // Subtask request handlers
  function handleSubtaskRequestConfirm() {
    if (subtaskRequestActivity) {
      openAddSubtask(subtaskRequestActivity.id);
    }
    setSubtaskRequestOpen(false);
    setSubtaskRequestActivity(null);
  }

  function handleSubtaskRequestCancel() {
    setSubtaskRequestOpen(false);
    setSubtaskRequestActivity(null);
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

  const subtaskParent = subtaskActivityId ? activities.find(a => a.id === subtaskActivityId) : null;
  const editingSubtask = editingSubtaskId && subtaskParent
    ? (subtaskParent.subtasks || []).find(s => s.id === editingSubtaskId)
    : null;

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

    // Calcular horas totales incluyendo subtareas
    const totalHoras = activities.reduce((sum, a) => {
      // Sumar horas de la actividad
      let activityHours = a.horasEst || 0;
      
      // Si tiene subtareas, sumar las horas de las subtareas en lugar de la actividad
      if (a.subtasks && a.subtasks.length > 0) {
        const subtaskHours = a.subtasks.reduce((subSum, s) => subSum + (s.horas_estimadas || 0), 0);
        activityHours = subtaskHours;
      }
      
      return sum + activityHours;
    }, 0);
    
    const horasCompletadas = activities.reduce((sum, a) => {
      // Sumar horas completadas de la actividad
      let completedHours = a.horasComp || 0;
      
      // Si tiene subtareas, sumar solo las horas de subtareas completadas
      if (a.subtasks && a.subtasks.length > 0) {
        const completedSubtaskHours = a.subtasks
          .filter(s => s.done)
          .reduce((subSum, s) => subSum + (s.horas_estimadas || 0), 0);
        completedHours = completedSubtaskHours;
      }
      
      return sum + completedHours;
    }, 0);
    
    const progresoGeneral = totalHoras > 0 ? Math.round((horasCompletadas / totalHoras) * 100) : 0;

    const totalSubtareas = activities.reduce((sum, a) => sum + (a.subtasks?.length || 0), 0);
    const subtareasCompletadas = activities.reduce((sum, a) => {
      return sum + (a.subtasks?.filter(s => s.done).length || 0);
    }, 0);

    // Get today's date (local time)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Count activities for today (considering subtask dates too)
    const actividadesHoy = activities.filter(a => {
      if (a.fecha === todayStr) return true;
      if (a.subtasks && a.subtasks.length > 0) {
        return a.subtasks.some(s => !s.done && s.fecha_entrega === todayStr);
      }
      return false;
    }).length;

    // Overdue count - NOTA: Este cálculo es incorrecto porque no cuenta subtareas vencidas
    // Se mantiene aquí por compatibilidad pero NO se debe usar
    // Usar groupedActivities.overdue.length en su lugar
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
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

  // Get activities grouped by date (subtasks classified individually)
  const groupedActivities = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const overdue = [];
    const todayActivities = [];
    const upcoming = [];
    
    activities.forEach(activity => {
      if (!activity.fecha) {
        upcoming.push(activity);
        return;
      }

      const hasSubtasks = activity.subtasks && activity.subtasks.length > 0;
      
      // Si no tiene subtareas, clasificar por fecha de la actividad
      if (!hasSubtasks) {
        if (activity.fecha < todayStr && activity.estado !== 'completada') {
          overdue.push(activity);
        } else if (activity.fecha === todayStr) {
          todayActivities.push(activity);
        } else {
          upcoming.push(activity);
        }
        return;
      }

      // Si tiene subtareas, crear copias de la actividad con subtareas filtradas por fecha
      // Excluir subtareas completadas (done: true) del conteo
      const subtareasOverdue = activity.subtasks.filter(s => s.fecha_entrega && s.fecha_entrega < todayStr && !s.done);
      const subtareasHoy = activity.subtasks.filter(s => s.fecha_entrega && s.fecha_entrega === todayStr && !s.done);
      const subtareasUpcoming = activity.subtasks.filter(s => (!s.fecha_entrega || s.fecha_entrega > todayStr) && !s.done);

      if (subtareasOverdue.length > 0) {
        overdue.push({ ...activity, subtasks: subtareasOverdue });
      }
      if (subtareasHoy.length > 0) {
        todayActivities.push({ ...activity, subtasks: subtareasHoy });
      }
      if (subtareasUpcoming.length > 0) {
        upcoming.push({ ...activity, subtasks: subtareasUpcoming });
      }
      // Si todas las subtareas están completadas
      if (subtareasOverdue.length === 0 && subtareasHoy.length === 0 && subtareasUpcoming.length === 0) {
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

  // Get count for "Para hoy" from grouped activities
  // Contar subtareas en lugar de actividades
  const actividadesParaHoy = useMemo(() => {
    return groupedActivities.today.reduce((count, activity) => {
      if (activity.subtasks && activity.subtasks.length > 0) {
        return count + activity.subtasks.length;
      }
      return count + 1; // Si no tiene subtareas, contar la actividad misma
    }, 0);
  }, [groupedActivities.today]);

  // Contar subtareas vencidas
  const subtareasVencidas = useMemo(() => {
    return groupedActivities.overdue.reduce((count, activity) => {
      if (activity.subtasks && activity.subtasks.length > 0) {
        return count + activity.subtasks.length;
      }
      return count + 1; // Si no tiene subtareas, contar la actividad misma
    }, 0);
  }, [groupedActivities.overdue]);

  // Contar subtareas próximas
  const subtareasProximas = useMemo(() => {
    return groupedActivities.upcoming.reduce((count, activity) => {
      if (activity.subtasks && activity.subtasks.length > 0) {
        return count + activity.subtasks.length;
      }
      return count + 1; // Si no tiene subtareas, contar la actividad misma
    }, 0);
  }, [groupedActivities.upcoming]);

  const hasActivities = activities.length > 0;
  const hasPendingOrSubtasks = stats.pendientes > 0 || stats.totalSubtareas > 0;

  return (
    <main className="dashboard-page">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Hola 👋</h1>
          <p className="dashboard-subtitle">
            {hasActivities 
              ? `Tienes ${actividadesParaHoy + stats.pendientes + stats.enProgreso} tareas pendientes`
              : '¡Comienza a organizar tus tareas!'
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-see-all" onClick={() => navigate('/actividades')}>
            Ver todas
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className="btn-new-task" onClick={openNewActivity}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva Tarea
          </button>
        </div>
      </header>

      {/* Daily Limit Section - Compact */}
      <section className="daily-limit-compact">        <div className="limit-compact-header">
          <span className="limit-compact-title">Límite: {stats.horasCompletadas}h / {limiteDiario}h</span>
          <div className="limit-compact-bar">
            <div 
              className="limit-compact-fill" 
              style={{ width: `${Math.min((stats.horasCompletadas / limiteDiario) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <button className="btn-compact-edit" onClick={() => setShowLimitModal(true)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
          </svg>
        </button>
      </section>

      {/* SCRUM-50: Sobrecarga en dashboard */}
      {isOverloaded && !conflictDismissed && (
        <div className="conflict-banner" role="alert">
          <span className="conflict-banner__icon">⚠️</span>
          <div className="conflict-banner__body">
            <div className="conflict-banner__title">Sobrecarga de horas detectada</div>
            <div className="conflict-banner__desc">
              Tenés <strong>{totalHorasActivas}h</strong> estimadas en actividades activas, pero tu límite diario es <strong>{limiteDiario}h</strong>. Considerá reducir horas o completar actividades.
            </div>
          </div>
          <button className="conflict-banner__close" onClick={() => setConflictDismissed(true)} aria-label="Cerrar aviso">✕</button>
        </div>
      )}

      {/* SCRUM-54: Resolución de conflicto en dashboard */}
      {resolvedVisible && (
        <div className="conflict-banner resolved" role="status">
          <span className="conflict-banner__icon">✅</span>
          <div className="conflict-banner__body">
            <div className="conflict-banner__title">Conflicto resuelto</div>
            <div className="conflict-banner__desc">
              Tus horas activas ({totalHorasActivas}h) ya están dentro del límite diario ({limiteDiario}h).
            </div>
          </div>
          <button className="conflict-banner__close" onClick={() => setResolvedVisible(false)} aria-label="Cerrar aviso">✕</button>
        </div>
      )}

      {hasPendingOrSubtasks && (
      /* Progress Overview Card */
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
      )}

      {/* Dashboard Grid - Buttons + Columns */}
      <section className="dashboard-grid">
        {/* Para Hoy - Mostrar subtareas directamente */}
        <div className="dashboard-grid-item">
          <button className={`quick-stat-btn highlight ${collapsedSections.today ? 'collapsed' : ''}`} onClick={() => toggleSection('today')}>
            <div className="quick-stat-icon">🎯</div>
            <div className="quick-stat-content">
              <span className="quick-stat-value">{actividadesParaHoy}</span>
              <span className="quick-stat-label">Para hoy</span>
            </div>
            <svg className="stat-collapse-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {!collapsedSections.today && groupedActivities.today.length > 0 && (
            <div className="activity-column today">
              {groupedActivities.today.flatMap(activity => 
                (activity.subtasks || []).length > 0 
                  ? (activity.subtasks || []).map(sub => (
                      <DashboardSubtaskItem 
                        key={sub.id} 
                        subtask={sub} 
                        parentActivity={activity}
                        onAddSubtask={openAddSubtask}
                        onEditSubtask={openEditSubtask}
                        onDeleteSubtask={handleDeleteSubtask}
                      />
                    ))
                  : [<DashboardActivityItem 
                      key={activity.id}
                      activity={activity}
                      isExpanded={expandedActivityId === activity.id}
                      onToggle={() => toggleActivityExpand(activity.id)}
                      onEdit={handleEditActivity}
                      onDelete={handleDeleteActivity}
                      onAddSubtask={openAddSubtask}
                      onEditSubtask={openEditSubtask}
                    />]
              )}
            </div>
          )}
        </div>
          
        {/* Vencidas */}
        <div className="dashboard-grid-item">
          <button className={`quick-stat-btn warning ${collapsedSections.overdue ? 'collapsed' : ''}`} onClick={() => toggleSection('overdue')}>
            <div className="quick-stat-icon">⚠️</div>
            <div className="quick-stat-content">
              <span className="quick-stat-value">{subtareasVencidas}</span>
              <span className="quick-stat-label">Vencidas</span>
            </div>
            <svg className="stat-collapse-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {!collapsedSections.overdue && groupedActivities.overdue.length > 0 && (
            <div className="activity-column overdue">
              {groupedActivities.overdue.flatMap(activity => 
                (activity.subtasks || []).length > 0 
                  ? (activity.subtasks || []).map(sub => (
                      <DashboardSubtaskItem 
                        key={sub.id} 
                        subtask={sub} 
                        parentActivity={activity}
                        onAddSubtask={openAddSubtask}
                        onEditSubtask={openEditSubtask}
                        onDeleteSubtask={handleDeleteSubtask}
                      />
                    ))
                  : [<DashboardActivityItem 
                      key={activity.id}
                      activity={activity}
                      isExpanded={expandedActivityId === activity.id}
                      onToggle={() => toggleActivityExpand(activity.id)}
                      onEdit={handleEditActivity}
                      onDelete={handleDeleteActivity}
                      onAddSubtask={openAddSubtask}
                      onEditSubtask={openEditSubtask}
                    />]
              )}
            </div>
          )}
        </div>

        {/* Próximas */}
        <div className="dashboard-grid-item">
          <button className={`quick-stat-btn ${collapsedSections.upcoming ? 'collapsed' : ''}`} onClick={() => toggleSection('upcoming')}>
            <div className="quick-stat-icon">📆</div>
            <div className="quick-stat-content">
              <span className="quick-stat-value">{subtareasProximas}</span>
              <span className="quick-stat-label">Próximas</span>
            </div>
            <svg className="stat-collapse-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {!collapsedSections.upcoming && groupedActivities.upcoming.length > 0 && (
            <div className="activity-column upcoming">
              {groupedActivities.upcoming.slice(0, 5).flatMap(activity => 
                (activity.subtasks || []).length > 0 
                  ? (activity.subtasks || []).map(sub => (
                      <DashboardSubtaskItem 
                        key={sub.id} 
                        subtask={sub} 
                        parentActivity={activity}
                        onAddSubtask={openAddSubtask}
                        onEditSubtask={openEditSubtask}
                        onDeleteSubtask={handleDeleteSubtask}
                      />
                    ))
                  : [<DashboardActivityItem 
                      key={activity.id}
                      activity={activity}
                      isExpanded={expandedActivityId === activity.id}
                      onToggle={() => toggleActivityExpand(activity.id)}
                      onEdit={handleEditActivity}
                      onDelete={handleDeleteActivity}
                      onAddSubtask={openAddSubtask}
                      onEditSubtask={openEditSubtask}
                    />]
              )}
            </div>
          )}
        </div>
      </section>

        {/* Activity Modal */}
      <ActivityModal
        open={activityModalOpen}
        editingActivity={editingActivity}
        onClose={closeActivityModal}
        onSave={handleSaveActivity}
        limiteDiario={limiteDiario}
        horasActuales={totalHorasActivas}
      />

      {/* Subtask Modal */}
      <SubtaskModal
        open={subtaskModalOpen}
        parentActivity={subtaskParent}
        editingSubtask={editingSubtask}
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

      {/* Subtask Delete Confirmation */}
      <ConfirmDialog
        open={deleteSubtaskDialogOpen}
        title="¿Eliminar subtarea?"
        message={deletingSubtask ? `¿Eliminar la subtarea? Esta acción no se puede deshacer.` : ''}
        onCancel={handleCancelDeleteSubtask}
        onConfirm={handleConfirmDeleteSubtask}
      />

      {/* Subtask Request Dialog */}
      <SubtaskRequest
        open={subtaskRequestOpen}
        activityTitle={subtaskRequestActivity?.titulo || ''}
        onConfirm={handleSubtaskRequestConfirm}
        onCancel={handleSubtaskRequestCancel}
      />

      {/* Daily Limit Modal */}
      {showLimitModal && (
        <div className="modal-overlay">
          <div className="modal daily-limit-modal">
            <div className="modal-header">
              <h3>Editar Límite Diario</h3>
              <button className="modal-close" onClick={() => setShowLimitModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="daily-limit">Horas por día (1-16)</label>
                <div className="hours-display">
                  <span className="hours-icon">⏱️</span>
                  <div className="hours-input-wrap">
                    <input
                      id="daily-limit"
                      type="number"
                      min="1"
                      max="16"
                      step="0.5"
                      value={newLimit}
                      onChange={e => { setNewLimit(e.target.value); setLimitError(''); }}
                    />
                    <div className="hours-unit">horas por día</div>
                  </div>
                </div>
                <div className="range-hint">
                  <span>Mín: 1h</span>
                  <span>Máx: 16h</span>
                </div>
                {limitError && <span className="field-error-msg">{limitError}</span>}
                <span className="field-hint">Actualmente: {limiteDiario} horas</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowLimitModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveLimit}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="success-banner show">
          {successMessage}
        </div>
      )}
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
