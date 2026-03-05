import React from 'react';
import DropdownFilter from './DropdownFilter';
import './ActivityFilters.css';

const TIPO_OPTIONS = [
  { value: null, label: 'Todos los tipos', dot: '#ccc' },
  { value: 'Tarea', label: 'Tarea', dot: '#8b6af8' },
  { value: 'Examen', label: 'Examen', dot: '#ef4444' },
  { value: 'Taller', label: 'Taller', dot: '#f59e0b' },
  { value: 'Proyecto', label: 'Proyecto', dot: '#10b981' },
  { value: 'Quiz', label: 'Quiz', dot: '#3b82f6' },
];

const PRIORIDAD_OPTIONS = [
  { value: null, label: 'Todas las prioridades', dot: '#ccc' },
  { value: 'Urgente', label: 'Urgente', dot: '#e11d48' },
  { value: 'Alta', label: 'Alta', dot: '#ef4444' },
  { value: 'Media', label: 'Media', dot: '#f59e0b' },
  { value: 'Baja', label: 'Baja', dot: '#10b981' },
];

const ORDEN_OPTIONS = [
  { value: 'fecha-asc', label: '📅 Fecha más próxima' },
  { value: 'fecha-desc', label: '📅 Fecha más lejana' },
  { value: 'prioridad', label: '🔴 Mayor prioridad' },
  { value: 'titulo', label: '🔤 Nombre A–Z' },
];

export default function ActivityFilters({ search, onSearch, tipo, onTipo, prioridad, onPrioridad, orden, onOrden }) {
  return (
    <div className="filters">
      <div className="search-box">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar actividades..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <DropdownFilter
        value={tipo}
        options={TIPO_OPTIONS}
        onChange={onTipo}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        }
      />

      <DropdownFilter
        value={prioridad}
        options={PRIORIDAD_OPTIONS}
        onChange={onPrioridad}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="21" y1="10" x2="3" y2="10" />
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="21" y1="14" x2="3" y2="14" />
            <line x1="21" y1="18" x2="3" y2="18" />
          </svg>
        }
      />

      <DropdownFilter
        value={orden}
        options={ORDEN_OPTIONS}
        onChange={onOrden}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        }
      />
    </div>
  );
}
