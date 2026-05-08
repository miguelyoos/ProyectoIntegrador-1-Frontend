import React, { useMemo } from 'react';
import { useActivities } from '../../context/ActivitiesContext';
import './DailyHoursProgress.css';

export default function DailyHoursProgress({ activities }) {
  const { limiteDiario } = useActivities();

  // Calcular horas de subtareas para hoy
  const horasSubtareasHoy = useMemo(() => {
    const hoy = new Date();
    const todayStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    
    let total = 0;
    activities.forEach(activity => {
      if (activity.subtasks && activity.subtasks.length > 0) {
        activity.subtasks.forEach(subtask => {
          if (subtask.fecha_entrega === todayStr && !subtask.done) {
            total += Number(subtask.horas_estimadas) || 0;
          }
        });
      }
    });
    return total;
  }, [activities]);

  const porcentaje = limiteDiario > 0 ? Math.min(100, (horasSubtareasHoy / limiteDiario) * 100) : 0;
  const estado = horasSubtareasHoy > limiteDiario ? 'excedido' : horasSubtareasHoy > limiteDiario * 0.8 ? 'critico' : 'normal';

  return (
    <div className={`daily-hours-progress ${estado}`}>
      <div className="daily-hours-header">
        <span className="daily-hours-label">Subtareas de hoy</span>
        <span className="daily-hours-text">
          <strong>{horasSubtareasHoy.toFixed(1)}h</strong> / {limiteDiario}h
        </span>
      </div>
      
      <div className="daily-hours-bar-container">
        <div className="daily-hours-bar">
          <div
            className={`daily-hours-fill ${estado}`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        {horasSubtareasHoy > limiteDiario && (
          <div className="daily-hours-warning">
            ⚠️ Excedes por {(horasSubtareasHoy - limiteDiario).toFixed(1)}h
          </div>
        )}
      </div>
    </div>
  );
}
