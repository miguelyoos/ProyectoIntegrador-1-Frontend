import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../context/ActivitiesContext';
import './PlaceholderPage.css';

export function DashboardPage() {
  const { activities } = useActivities();
  const navigate = useNavigate();

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
        <button className="btn-new-task" onClick={() => navigate('/actividades')}>
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
                <li key={activity.id} className="activity-item" onClick={() => navigate('/actividades')}>
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
                </li>
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
                <li key={activity.id} className="activity-item" onClick={() => navigate('/actividades')}>
                  <div className={`priority-indicator ${activity.prioridad?.toLowerCase()}`}></div>
                  <div className="activity-info">
                    <span className="activity-title">{activity.titulo}</span>
                    <span className="activity-meta overdue-date">{activity.fecha}</span>
                  </div>
                  <div className={`status-badge ${activity.estado}`}>
                    {activity.estado === 'completada' ? '✓' : activity.estado === 'progreso' ? '↻' : '○'}
                  </div>
                </li>
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
                <li key={activity.id} className="activity-item" onClick={() => navigate('/actividades')}>
                  <div className={`priority-indicator ${activity.prioridad?.toLowerCase()}`}></div>
                  <div className="activity-info">
                    <span className="activity-title">{activity.titulo}</span>
                    <span className="activity-meta">{activity.fecha}</span>
                  </div>
                  <div className={`status-badge ${activity.estado}`}>
                    {activity.estado === 'completada' ? '✓' : activity.estado === 'progreso' ? '↻' : '○'}
                  </div>
                </li>
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
            <button className="btn-primary" onClick={() => navigate('/actividades')}>
              Crear primera tarea
            </button>
          </div>
        )}
      </section>
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
