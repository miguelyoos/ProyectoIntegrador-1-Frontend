export const PRIO_COLORS = {
  Alta: '#ef4444',
  Urgente: '#e11d48',
  Media: '#f59e0b',
  Baja: '#10b981',
};

export const PRIO_ORDER = { Urgente: 4, Alta: 3, Media: 2, Baja: 1 };

export function calcEstado(horasComp, horasEst) {
  if (horasComp >= horasEst && horasEst > 0) return 'completada';
  if (horasComp > 0) return 'progreso';
  return 'pendiente';
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });
}

// Calcular horas totales de subtareas para una fecha específica
export function calcularHorasSubtareasEnFecha(activities, fecha) {
  let total = 0;
  activities.forEach(activity => {
    if (activity.subtasks && activity.subtasks.length > 0) {
      activity.subtasks.forEach(subtask => {
        if (subtask.fecha_entrega === fecha && !subtask.done) {
          total += Number(subtask.horas_estimadas) || 0;
        }
      });
    }
  });
  return total;
}

// Calcular horas totales de subtareas para hoy
export function calcularHorasSubtareasHoy(activities) {
  const hoy = new Date();
  const todayStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  return calcularHorasSubtareasEnFecha(activities, todayStr);
}

// Validar si una subtarea excede el límite diario
export function validarExcededeLimite(activities, fechaSubtarea, horasSubtarea, limiteDiario, excluirSubtaskId = null) {
  let horasActuales = calcularHorasSubtareasEnFecha(activities, fechaSubtarea);
  
  // Si estamos editando, restar las horas de la subtarea anterior
  if (excluirSubtaskId) {
    const subtaskAnterior = activities.reduce((found, activity) => {
      if (found) return found;
      const sub = (activity.subtasks || []).find(s => s.id === excluirSubtaskId);
      return sub;
    }, null);
    
    if (subtaskAnterior) {
      horasActuales -= Number(subtaskAnterior.horas_estimadas) || 0;
    }
  }
  
  const totalConNueva = horasActuales + horasSubtarea;
  return {
    excede: totalConNueva > limiteDiario,
    totalHoras: totalConNueva,
    horasActuales
  };
}
