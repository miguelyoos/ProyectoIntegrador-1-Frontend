import React, { useMemo } from 'react';
import { useActivities } from '../context/ActivitiesContext';
import './PlaceholderPage.css';

export function DashboardPage() {
  const { activities } = useActivities();

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
      actividadesHoy
    };
  }, [activities]);

  // Get recent activities (last 5)
  const recentActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
      .slice(0, 5);
  }, [activities]);

  return (
    <main className="dashboard-page">
      <h2 className="dashboard-title">Resumen de Hoy</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Actividades</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendientes}</div>
          <div className="stat-label">Pendientes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-value">{stats.enProgreso}</div>
          <div className="stat-label">En Progreso</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completadas}</div>
          <div className="stat-label">Completadas</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <h3>Progreso General</h3>
        <div className="progress-container">
          <div className="progress-header">
            <span>Horas completadas</span>
            <span>{stats.horasCompletadas}h / {stats.totalHoras}h</span>
          </div>
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large" 
              style={{ width: `${stats.progresoGeneral}%` }}
            />
          </div>
          <div className="progress-percentage">{stats.progresoGeneral}% completado</div>
        </div>

        <div className="subtasks-progress">
          <div className="subtasks-icon">📝</div>
          <div className="subtasks-info">
            <span className="subtasks-label">Subtareas</span>
            <span className="subtasks-value">
              {stats.subtareasCompletadas} / {stats.totalSubtareas} completadas
            </span>
          </div>
        </div>
      </div>

      {/* Today's Activities */}
      <div className="today-section">
        <h3>Actividades de Hoy</h3>
        {stats.actividadesHoy > 0 ? (
          <div className="today-count">
            <span className="today-number">{stats.actividadesHoy}</span>
            <span className="today-label">actividad{stats.actividadesHoy !== 1 ? 'es' : ''} para hoy</span>
          </div>
        ) : (
          <p className="no-activities">No hay actividades programadas para hoy 🎉</p>
        )}
      </div>

      {/* Recent Activities */}
      <div className="recent-section">
        <h3>Actividades Recientes</h3>
        {recentActivities.length > 0 ? (
          <ul className="recent-list">
            {recentActivities.map(activity => (
              <li key={activity.id} className="recent-item">
                <span className={`status-dot ${activity.estado}`}></span>
                <span className="recent-title">{activity.titulo}</span>
                <span className={`badge badge-${activity.estado}`}>{activity.estado}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-activities">No hay actividades todavía. ¡Crea una!</p>
        )}
      </div>
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
