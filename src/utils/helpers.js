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

export function formatHours(hours) {
  if (hours === null || hours === undefined || hours === '') return '0';
  
  // Convertir a número, manejando strings con formato incorrecto
  let num = Number(hours);
  
  // Si la conversión falla, intentar limpiar el string
  if (isNaN(num)) {
    // Remover ceros a la izquierda y convertir
    const cleaned = String(hours).replace(/^0+/, '') || '0';
    num = Number(cleaned);
  }
  
  // Si aún no es un número válido, retornar 0
  if (isNaN(num)) return '0';
  
  // Si es un número entero, mostrarlo sin decimales
  if (Number.isInteger(num)) return num.toString();
  
  // Si tiene decimales, mostrar máximo 1 decimal y remover .0 al final
  return num.toFixed(1).replace(/\.0$/, '');
}
