import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearActividad } from '../services/api';

export default function CrearActividad() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearActividad({ titulo, descripcion, fecha });
    navigate('/hoy');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#fff', fontSize: '2rem', fontWeight: '700' }}>Crear Actividad</h1>
      
      <div style={{ maxWidth: '600px', background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#000', fontSize: '0.875rem' }}>
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nombre de la actividad"
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f9fafb'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#f9fafb';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#000', fontSize: '0.875rem' }}>
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles de la actividad (opcional)"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f9fafb',
                minHeight: '120px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#f9fafb';
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#000', fontSize: '0.875rem' }}>
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f9fafb'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#000';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#f9fafb';
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.875rem',
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
              Crear Actividad
            </button>
            <button
              type="button"
              onClick={() => navigate('/hoy')}
              style={{
                flex: 1,
                padding: '0.875rem',
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
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
