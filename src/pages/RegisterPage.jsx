import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/login/FormField';
import PasswordInput from '../components/login/PasswordInput';
import SuccessMessage from '../components/login/SuccessMessage';
import { register } from '../services/RegisterService';
import './RegisterPage.css';

// ── Validation helpers ────────────────────────────────────────
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getEmailError(v) {
  if (!v) return 'El correo es obligatorio.';
  if (!v.includes('@')) return 'Falta el @. Ej: tu@correo.com';
  if (v.endsWith('@')) return 'Falta el dominio después del @. Ej: tu@correo.com';
  if (!v.split('@')[1]?.includes('.')) return 'El dominio parece incompleto. Ej: tu@correo.com';
  return '';
}

function getUsernameError(v) {
  if (!v) return 'El nombre de usuario es obligatorio.';
  if (v.length < 3) return 'Mínimo 3 caracteres.';
  if (!/^[a-zA-Z0-9]+$/.test(v)) return 'Solo letras y números. Sin caracteres especiales.';
  return '';
}

function getFirstNameError(v) {
  if (!v) return 'El nombre es obligatorio.';
  if (v.length < 2) return 'Mínimo 2 caracteres.';
  return '';
}

function getLastNameError(v) {
  if (!v) return 'El apellido es obligatorio.';
  if (v.length < 2) return 'Mínimo 2 caracteres.';
  return '';
}

function getPasswordError(v) {
  if (!v) return 'La contraseña es obligatoria.';
  if (v.length < 8) return `Muy corta — usa al menos 8 caracteres. Te faltan ${8 - v.length}.`;
  return '';
}

function getConfirmPasswordError(v, password) {
  if (!v) return 'Confirma tu contraseña.';
  if (v !== password) return 'Las contraseñas no coinciden.';
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

  const [usernameError, setUsernameError]   = useState('');
  const [emailError, setEmailError]         = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError]   = useState('');
  const [passwordError, setPasswordError]   = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

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

  // ── Blur handlers ───────────────────────────────────────────
  function handleUsernameBlur() {
    const v = username.trim();
    if (v) setUsernameError(getUsernameError(v));
  }

  function handleEmailBlur() {
    const v = email.trim();
    if (v) setEmailError(getEmailError(v));
  }

  function handleFirstNameBlur() {
    const v = firstName.trim();
    if (v) setFirstNameError(getFirstNameError(v));
  }

  function handleLastNameBlur() {
    const v = lastName.trim();
    if (v) setLastNameError(getLastNameError(v));
  }

  function handlePasswordBlur() {
    const msg = getPasswordError(password);
    setPasswordError(msg);
  }

  function handleConfirmPasswordBlur() {
    const msg = getConfirmPasswordError(confirmPassword, password);
    setConfirmPasswordError(msg);
  }

  // ── Input handlers (clear error when valid) ─────────────────
  function handleUsernameChange(e) {
    const v = e.target.value;
    setUsername(v);
    if (usernameError && v.trim().length >= 3) setUsernameError('');
  }

  function handleEmailChange(e) {
    const v = e.target.value;
    setEmail(v);
    if (emailError && isValidEmail(v.trim())) setEmailError('');
  }

  function handleFirstNameChange(e) {
    const v = e.target.value;
    setFirstName(v);
    if (firstNameError && v.trim().length >= 2) setFirstNameError('');
  }

  function handleLastNameChange(e) {
    const v = e.target.value;
    setLastName(v);
    if (lastNameError && v.trim().length >= 2) setLastNameError('');
  }

  function handlePasswordChange(e) {
    const v = e.target.value;
    setPassword(v);
    if (passwordError && v.length >= 8) setPasswordError(getPasswordError(v));
  }

  function handleConfirmPasswordChange(e) {
    const v = e.target.value;
    setConfirmPassword(v);
    if (confirmPasswordError) setConfirmPasswordError(getConfirmPasswordError(v, password));
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit(e) {
    e?.preventDefault();

    const usernameVal = username.trim();
    const emailVal = email.trim();
    const firstNameVal = firstName.trim();
    const lastNameVal = lastName.trim();
    const passwordVal = password;
    const confirmPasswordVal = confirmPassword;

    let valid = true;

    // All empty case
    if (!usernameVal && !emailVal && !firstNameVal && !lastNameVal && !passwordVal && !confirmPasswordVal) {
      setUsernameError('El nombre de usuario es obligatorio.');
      setEmailError('El correo es obligatorio.');
      setFirstNameError('El nombre es obligatorio.');
      setLastNameError('El apellido es obligatorio.');
      setPasswordError('La contraseña es obligatoria.');
      setConfirmPasswordError('Confirma tu contraseña.');
      shake();
      return;
    }

    const uErr = getUsernameError(usernameVal);
    if (uErr) { setUsernameError(uErr); valid = false; }
    else setUsernameError('');

    const eErr = getEmailError(emailVal);
    if (eErr) { setEmailError(eErr); valid = false; }
    else setEmailError('');

    const fnErr = getFirstNameError(firstNameVal);
    if (fnErr) { setFirstNameError(fnErr); valid = false; }
    else setFirstNameError('');

    const lnErr = getLastNameError(lastNameVal);
    if (lnErr) { setLastNameError(lnErr); valid = false; }
    else setLastNameError('');

    const pErr = getPasswordError(passwordVal);
    if (pErr) { setPasswordError(pErr); valid = false; }
    else setPasswordError('');

    const cpErr = getConfirmPasswordError(confirmPasswordVal, passwordVal);
    if (cpErr) { setConfirmPasswordError(cpErr); valid = false; }
    else setConfirmPasswordError('');

    if (!valid) { shake(); return; }

    setLoading(true);

    try {
      await register({
        username: usernameVal,
        email: emailVal,
        first_name: firstNameVal,
        last_name: lastNameVal,
        password: passwordVal,
      });

      navigate('/login');

    } catch (error) {
      if (error.response?.data?.email) {
        setEmailError(error.response.data.email);
      } else if (error.response?.data?.username) {
        setUsernameError(error.response.data.username);
      } else {
        setEmailError('Error al registrar. Intenta de nuevo.');
      }
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
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              placeholder="usuario123"
              autoComplete="username"
              error={usernameError}
            />

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

            <div className="register-row">
              <FormField
                id="firstName"
                label="Nombre"
                labelIcon={<UserIcon />}
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
                onBlur={handleFirstNameBlur}
                placeholder="Juan"
                autoComplete="given-name"
                error={firstNameError}
              />

              <FormField
                id="lastName"
                label="Apellido"
                labelIcon={<UserIcon />}
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                onBlur={handleLastNameBlur}
                placeholder="Pérez"
                autoComplete="family-name"
                error={lastNameError}
              />
            </div>

            <PasswordInput
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordError}
              placeholder="Mínimo 8 caracteres"
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              error={confirmPasswordError}
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
