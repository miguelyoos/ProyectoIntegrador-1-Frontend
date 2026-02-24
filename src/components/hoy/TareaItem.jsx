import { useNavigate } from 'react-router-dom';
import { actualizarActividad } from '../../services/api';

export default function TareaItem({ tarea, onUpdate }) {
  const navigate = useNavigate();

  const handleToggle = async (e) => {
    e.stopPropagation();
    await actualizarActividad(tarea.id, { completada: !tarea.completada });
    onUpdate();
  };

  return (
    <div
      onClick={() => navigate(`/actividad/${tarea.id}`)}
      style={{
        background: '#fff',
        padding: '1.25rem',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={handleToggle}
        style={{ 
          width: '20px', 
          height: '20px', 
          cursor: 'pointer',
          accentColor: '#000'
        }}
      />
      <div style={{ flex: 1 }}>
        <h3 style={{ 
          margin: 0, 
          textDecoration: tarea.completada ? 'line-through' : 'none', 
          color: tarea.completada ? '#9ca3af' : '#000',
          fontWeight: '600',
          fontSize: '1rem'
        }}>
          {tarea.titulo}
        </h3>
        {tarea.descripcion && (
          <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>{tarea.descripcion}</p>
        )}
      </div>
    </div>
  );
}
