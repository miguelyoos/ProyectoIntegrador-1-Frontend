import React, { useMemo } from 'react';
import { useActivities } from '../../context/ActivitiesContext';
import { calcularHorasSubtareasHoy } from '../../utils/helpers';
import './DailyHoursProgress.css';

export default function DailyHoursProgress({ activities }) {
  const { limiteDiario } = useActivities();

  // Usar la función del helper que ya está siendo usada en otros lugares
  const horasSubtareasHoy = useMemo(() => {
    if (!activities || activities.length === 0) return 0;
    const horas = calcularHorasSubtareasHoy(activities);
    console.log('📊 DailyHoursProgress - Actividades:', activities.length, 'Horas de hoy:', horas);
    return horas;
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
