import { useState } from 'react';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    window.location.href = '/hoy';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#000',
      padding: '1rem'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '3rem 2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(255,255,255,0.1)', 
        width: '100%', 
        maxWidth: '420px',
        border: '1px solid #333'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: '#000', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.875rem', color: '#000' }}>Bienvenido</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#000', fontSize: '0.875rem' }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#f9fafb';
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#000', fontSize: '0.875rem' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <input
                type={mostrarContraseña ? 'text' : 'password'}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#f9fafb';
                }}
              />
              <button
                type="button"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {mostrarContraseña ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
