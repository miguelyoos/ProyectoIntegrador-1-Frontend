import React from 'react';
import './PlaceholderPage.css';

export function DashboardPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-icon">📊</div>
      <h2>Hoy</h2>
      <p>Próximamente: resumen de tus actividades, estadísticas y progreso general.</p>
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
