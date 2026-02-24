import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerActividad, actualizarActividad, eliminarActividad } from '../services/api';

export default function ActividadDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actividad, setActividad] = useState(null);

  useEffect(() => {
    cargarActividad();
  }, [id]);

  const cargarActividad = async () => {
    const data = await obtenerActividad(id);
    setActividad(data);
  };

  const handleToggleCompletada = async () => {
    await actualizarActividad(id, { completada: !actividad.completada });
    cargarActividad();
  };

  const handleEliminar = async () => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      await eliminarActividad(id);
      navigate('/hoy');
    }
  };

  if (!actividad) return (
    <div style={{ color: '#fff', fontSize: '1.125rem', textAlign: 'center', marginTop: '3rem' }}>
      Cargando...
    </div>
  );

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ margin: 0, color: '#000', fontSize: '2rem', fontWeight: '700' }}>{actividad.titulo}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              background: actividad.completada ? '#f0fdf4' : '#fef3c7',
              color: actividad.completada ? '#15803d' : '#a16207',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {actividad.completada ? '✓ Completada' : '○ Pendiente'}
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              📅 {actividad.fecha}
            </span>
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.75rem', color: '#000', fontSize: '1rem', fontWeight: '600' }}>Descripción</h3>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>
            {actividad.descripcion || 'Sin descripción'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleToggleCompletada}
          style={{
            flex: '1 1 auto',
            padding: '0.875rem 1.5rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#000';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {actividad.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        </button>
        
        <button
          onClick={() => navigate('/hoy')}
          style={{
            flex: '1 1 auto',
            padding: '0.875rem 1.5rem',
            background: '#fff',
            color: '#000',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          Volver
        </button>
        
        <button
          onClick={handleEliminar}
          style={{
            flex: '1 1 auto',
            padding: '0.875rem 1.5rem',
            background: '#fff',
            color: '#dc2626',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#dc2626';
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
