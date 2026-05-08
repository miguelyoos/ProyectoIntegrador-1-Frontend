import React, { useEffect, useRef, useState } from 'react';
import { useActivities } from '../../context/ActivitiesContext';
import ReduceLimitDialog from '../hoy/ReduceLimitDialog';
import { calcularHorasSubtareasHoy } from '../../utils/helpers';
import './LimitDailyHoursButton.css';

export default function LimitDailyHoursButton({ activities }) {
  const { limiteDiario, actualizarLimite } = useActivities();
  const [showMenu, setShowMenu] = useState(false);
  const [inputValue, setInputValue] = useState(limiteDiario.toString());
  const [reduceDialog, setReduceDialog] = useState({
    open: false,
    newLimit: limiteDiario
  });
  const limitButtonRef = useRef(null);
  const limitInputRef = useRef(null);

  const horasSubtareasHoy = calcularHorasSubtareasHoy(activities);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleApplyLimit = async (newLimit) => {
    const numNewLimit = parseFloat(newLimit);
    
    if (isNaN(numNewLimit) || numNewLimit <= 0) {
      alert('Por favor ingresa un número válido mayor a 0');
      return;
    }

    if (numNewLimit > limiteDiario) {
      // Aumentar límite sin validación
      await actualizarLimite(numNewLimit);
      setInputValue(numNewLimit.toString());
      setShowMenu(false);
    } else if (numNewLimit < limiteDiario) {
      // Reducir límite - validar que no hay conflicto
      setReduceDialog({
        open: true,
        newLimit: numNewLimit
      });
    } else {
      // Mismo límite, cerrar menú
      setShowMenu(false);
    }
  };

  const handleReduceConfirm = async () => {
    await actualizarLimite(reduceDialog.newLimit);
    setInputValue(reduceDialog.newLimit.toString());
    setReduceDialog({ ...reduceDialog, open: false });
    setShowMenu(false);
  };

  useEffect(() => {
    if (!showMenu) return;

    limitInputRef.current?.focus();

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setShowMenu(false);
        limitButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMenu]);

  return (
    <>
      <div className="limit-daily-hours-button">
        <button
          className="limit-btn"
          title={`Límite diario: ${limiteDiario}h`}
          aria-label={`Límite diario ${limiteDiario} horas`}
          aria-expanded={showMenu}
          aria-controls="limit-menu"
          ref={limitButtonRef}
          onClick={() => setShowMenu(!showMenu)}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {limiteDiario}h
        </button>

        {showMenu && (
          <div className="limit-menu" id="limit-menu" role="dialog" aria-modal="false" aria-label="Configurar límite diario">
            <div className="limit-menu-header">
              <h4>Límite diario de estudio</h4>
              <button
                className="limit-menu-close"
                aria-label="Cerrar menú de límite diario"
                onClick={() => setShowMenu(false)}
              >
                ✕
              </button>
            </div>

            <div className="limit-menu-content">
              <div className="limit-current">
                <span>Actual:</span>
                <strong>{limiteDiario}h</strong>
              </div>

              <div className="limit-input-group">
                <label htmlFor="limit-input">Nuevo límite (horas)</label>
                <input
                  id="limit-input"
                  type="number"
                  ref={limitInputRef}
                  min="0.5"
                  step="0.5"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ej: 8"
                />
              </div>

              <div className="limit-info">
                <small>
                  Hoy tienes <strong>{horasSubtareasHoy.toFixed(1)}h</strong> de subtareas programadas
                </small>
              </div>

              <button
                className="limit-apply-btn"
                onClick={() => handleApplyLimit(inputValue)}
              >
                Aplicar nuevo límite
              </button>
            </div>
          </div>
        )}
      </div>

      <ReduceLimitDialog
        open={reduceDialog.open}
        currentLimit={limiteDiario}
        newLimit={reduceDialog.newLimit}
        totalHoursScheduled={horasSubtareasHoy}
        onConfirm={handleReduceConfirm}
        onCancel={() => setReduceDialog({ ...reduceDialog, open: false })}
      />
    </>
  );
}
