import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/login/FormField';
import PasswordInput from '../components/login/PasswordInput';
import SuccessMessage from '../components/login/SuccessMessage';
import './RegisterPage.css';

// ── Logo SVG ──────────────────────────────────────────────────
const CalendarLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" />
    <path d="M8 2v4M16 2v4M3 9h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="13" width="3" height="3" rx="1" fill="white" />
    <rect x="14" y="13" width="3" height="3" rx="1" fill="white" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

export default function RegisterPage() {
  const [username, setUsername]         = useState('');
  const [email, setEmail]               = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]   = useState(false);

  const cardRef = useRef(null);
  const navigate = useNavigate();

  // ── Redirect after showing success message ──────────────────
  useEffect(() => {
    if (success) {
      navigate('/login');
    }
  }, [success, navigate]);

  // ── Shake animation ─────────────────────────────────────────
  function shake() {
    cardRef.current?.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-7px)' },
        { transform: 'translateX(7px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 340, easing: 'ease-out' }
    );
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit(e) {
    e?.preventDefault();

    setLoading(true);

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/login');

    } catch (error) {
      shake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-root">
      <div className="register-card" ref={cardRef}>

        {/* Header */}
        <div className="register-header">
          <div className="logo-wrap"><CalendarLogo /></div>
          <h1>Crear cuenta</h1>
          <p>Regístrate para comenzar a organizar tus tareas.</p>
        </div>

        {/* Form or success */}
        {success ? (
          <SuccessMessage />
        ) : (
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <FormField
              id="username"
              label="Nombre de usuario"
              labelIcon={<UserIcon />}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario123"
              autoComplete="username"
            />

            <FormField
              id="email"
              label="Correo electrónico"
              labelIcon={<EmailIcon />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
            />

            <div className="register-row">
              <FormField
                id="firstName"
                label="Nombre"
                labelIcon={<UserIcon />}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
                autoComplete="given-name"
              />

              <FormField
                id="lastName"
                label="Apellido"
                labelIcon={<UserIcon />}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
                autoComplete="family-name"
              />
            </div>

            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
            />

            <button
              type="submit"
              className={`btn-submit${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              <span className="btn-text">Crear cuenta</span>
              <div className="spinner" />
            </button>
          </form>
        )}

        {/* Divider + footer */}
        <div className="register-divider"><span>¿Ya tienes cuenta?</span></div>
        <p className="register-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Inicia sesión</a> — es más rápido.
        </p>
      </div>
    </div>
  );
}
