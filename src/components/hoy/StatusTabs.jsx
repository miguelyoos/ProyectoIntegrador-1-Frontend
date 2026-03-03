import React from 'react';
import './StatusTabs.css';

const TABS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'progreso', label: 'En Progreso' },
  { key: 'completada', label: 'Completadas' },
];

export default function StatusTabs({ current, counts, onChange }) {
  return (
    <div className="status-tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`status-tab${current === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label} ({counts[tab.key] ?? 0})
        </button>
      ))}
    </div>
  );
}
