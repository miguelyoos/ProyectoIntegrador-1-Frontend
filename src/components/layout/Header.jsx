import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [userEmail, setUserEmail] = useState('usuario@email.com');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="brand-text">
            <h1>Planificador de Estudio</h1>
            <p>Organiza tus evaluaciones</p>
          </div>
        </div>

        <div className="user-section">
          <span>{userEmail}</span>
          <button className="btn-salir" onClick={handleLogoutClick}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="logout-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            <div className="logout-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h2>¿Cerrar sesión?</h2>
            <p>¿Estás seguro de que quieres salir? Tendrás que volver a iniciar sesión.</p>
            <div className="logout-actions">
              <button className="btn-cancel-logout" onClick={handleLogoutCancel}>
                Cancelar
              </button>
              <button className="btn-confirm-logout" onClick={handleLogoutConfirm}>
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
