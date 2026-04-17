import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/login/FormField';
import { login } from '../services/authService';
import PasswordInput from '../components/login/PasswordInput';
import SuccessMessage from '../components/login/SuccessMessage';
import './LoginPage.css';
// import Hoy from './Hoy';

// ── Validation helpers ────────────────────────────────────────
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getEmailError(v) {
  if (!v)                               return 'Necesitamos tu correo para saber tu identidad.';
  if (!v.includes('@'))                 return 'Falta el @. Ej: tu@correo.com';
  if (v.endsWith('@'))                  return 'Falta el dominio después del @. Ej: tu@correo.com';
  if (!v.split('@')[1]?.includes('.'))  return 'El dominio parece incompleto. Ej: tu@correo.com';
  return '';
}

function getPasswordError(v) {
  if (!v)          return 'Sin contraseña no podemos verificar tu identidad.';
  if (v.length < 8) return `Muy corta — usa al menos 8 caracteres. Te faltan ${8 - v.length}.`;
  return '';
}

// ── Logo SVG ──────────────────────────────────────────────────
const CalendarLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" />
    <path d="M8 2v4M16 2v4M3 9h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="13" width="3" height="3" rx="1" fill="white" />
    <rect x="14" y="13" width="3" height="3" rx="1" fill="white" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [remember, setRemember]   = useState(false);

  const cardRef = useRef(null);
  const navigate = useNavigate();

  // ── Redirect after showing success message ──────────────────
  useEffect(() => {
    if (success) {
      // Redirect immediately without showing success message
      navigate('/hoy');
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

  // ── Blur handlers ───────────────────────────────────────────
  function handleEmailBlur() {
    const v = email.trim();
    if (!isValidEmail(v)) setEmailError(getEmailError(v));
    else setEmailError('');
  }

  function handlePasswordBlur() {
    const msg = getPasswordError(password);
    setPasswordError(msg);
  }

  // ── Input handlers (clear error when valid) ─────────────────
  function handleEmailChange(e) {
    const v = e.target.value;
    setEmail(v);
    if (isValidEmail(v.trim())) setEmailError('');
  }

  function handlePasswordChange(e) {
    const v = e.target.value;
    setPassword(v);
    // Live update the counter message if already showing an error
    if (passwordError) setPasswordError(getPasswordError(v));
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit(e) {
    e?.preventDefault();

    const emailVal = email.trim();
    const pwVal    = password;

    // Both empty: special case
    if (!emailVal && !pwVal) {
      setEmailError('Completa tu correo y contraseña para ingresar.');
      setPasswordError('Este campo también es obligatorio.');
      shake();
      return;
    }

    let valid = true;

    const eErr = isValidEmail(emailVal) ? '' : getEmailError(emailVal);
    if (eErr) { setEmailError(eErr); valid = false; }
    else setEmailError('');

    const pErr = getPasswordError(pwVal);
    if (pErr) { setPasswordError(pErr); valid = false; }
    else setPasswordError('');

    if (!valid) { shake(); return; }

    setLoading(true);

    try {
      const data = await login({
        email: emailVal,
        password: pwVal,
      });

      // Guardar token y email
      localStorage.setItem("token", data.access);
      localStorage.setItem("userEmail", emailVal);

      // Redirect immediately
      navigate("/hoy");

    } catch (error) {
      setEmailError("Credenciales incorrectas");
      setPasswordError("Verifica tus datos");
      shake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <div className="login-card" ref={cardRef}>

        {/* Header */}
        <div className="login-header">
          <div className="logo-wrap"><CalendarLogo /></div>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa para ver tus tareas y pendientes del día.</p>
        </div>

        {/* Form or success */}
        {success ? (
          <SuccessMessage />
        ) : (
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <FormField
              id="email"
              label="Correo electrónico"
              labelIcon={<EmailIcon />}
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="tu@correo.com"
              autoComplete="email"
              error={emailError}
            />

            <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError}
            />

            <div className="login-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              className={`btn-submit${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              <span className="btn-text">Ingresar</span>
              <div className="spinner" />
            </button>
          </form>
        )}

        {/* Divider + footer */}
        <div className="login-divider"><span>¿Aún no tienes cuenta?</span></div>
        <p className="login-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Crea una gratis</a> — tarda menos de un minuto.
        </p>

        {/* Modo local */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => {
              localStorage.setItem("localMode", "true");
              localStorage.setItem("token", "local-demo");
              localStorage.setItem("userEmail", "demo@local.com");
              navigate("/hoy");
            }}
            style={{
              background: 'none',
              border: '1px dashed #999',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#666'
            }}
          >
            🧪 Modo demo sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
