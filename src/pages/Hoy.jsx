import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GrupoTareas from '../components/hoy/GrupoTareas';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { obtenerActividadesHoy } from '../services/api';

export default function Hoy() {
  const [actividades, setActividades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    const data = await obtenerActividadesHoy();
    setActividades(data);
  };

  const actividadesPendientes = actividades.filter(a => !a.completada);
  const actividadesCompletadas = actividades.filter(a => a.completada);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: '700' }}>Hoy</h1>
        <button
          onClick={() => navigate('/crear')}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          + Nueva Actividad
        </button>
      </div>

      {actividades.length === 0 ? (
        <EmptyState mensaje="No tienes actividades para hoy" />
      ) : (
        <>
          {actividadesPendientes.length > 0 && (
            <GrupoTareas titulo="Pendientes" tareas={actividadesPendientes} onUpdate={cargarActividades} />
          )}
          {actividadesCompletadas.length > 0 && (
            <GrupoTareas titulo="Completadas" tareas={actividadesCompletadas} onUpdate={cargarActividades} />
          )}
        </>
      )}
    </div>
  );
}
