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

// Formatear horas de forma legible
export function formatHours(hours) {
  const num = Number(hours) || 0;
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

// Calcular horas totales de subtareas para una fecha específica
export function calcularHorasSubtareasEnFecha(activities, fecha) {
  let total = 0;
  
  if (!activities || !Array.isArray(activities)) {
    return total;
  }
  
  activities.forEach(activity => {
    // Manejar tanto 'subtasks' como 'subtareas'
    const subtasks = activity.subtasks || activity.subtareas || [];
    
    if (Array.isArray(subtasks) && subtasks.length > 0) {
      subtasks.forEach(subtask => {
        // Comparar la fecha (manejar diferentes nombres de campo)
        const subtaskFecha = subtask.fecha_entrega || subtask.fechaEntrega;
        const isDone = subtask.done === true;
        
        if (subtaskFecha === fecha && !isDone) {
          const horas = Number(subtask.horas_estimadas) || 0;
          total += horas;
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
      const subtasks = activity.subtasks || activity.subtareas || [];
      const sub = Array.isArray(subtasks) ? subtasks.find(s => s.id === excluirSubtaskId) : null;
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
