import { useState, useEffect } from 'react';
import { obtenerEstadisticas } from '../services/api';

export default function Progreso() {
  const [stats, setStats] = useState({ total: 0, completadas: 0, pendientes: 0 });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const data = await obtenerEstadisticas();
    setStats(data);
  };

  const porcentaje = stats.total > 0 ? Math.round((stats.completadas / stats.total) * 100) : 0;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#fff', fontSize: '2rem', fontWeight: '700' }}>Progreso</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#000' }}>{stats.total}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completadas</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#000' }}>{stats.completadas}</p>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pendientes</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#000' }}>{stats.pendientes}</p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, marginBottom: '1.5rem', color: '#000', fontSize: '1.25rem', fontWeight: '600' }}>Tasa de Completitud</h3>
        <div style={{ background: '#e5e7eb', height: '40px', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ background: '#000', height: '100%', width: `${porcentaje}%`, transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1rem' }}>
            {porcentaje > 10 && <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.875rem' }}>{porcentaje}%</span>}
          </div>
        </div>
        {porcentaje <= 10 && <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>{porcentaje}%</p>}
      </div>
    </div>
  );
}
