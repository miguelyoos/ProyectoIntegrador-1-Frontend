import React, { useState, useEffect } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { formatDate, validarExcededeLimite } from '../../utils/helpers';
import { useActivities } from '../../context/ActivitiesContext';
import HourlyLimitConflictDialog from './HourlyLimitConflictDialog';
import './SubtaskModal.css';

const SUB_FIELDS = ['sub-field-nombre', 'sub-field-fecha', 'sub-field-horas'];

export default function SubtaskModal({ open, parentActivity, editingSubtask, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [horas, setHoras] = useState('');
  const [bannerMsg, setBannerMsg] = useState('');
  const [shaking, setShaking] = useState(false);
  const [conflictDialog, setConflictDialog] = useState({
    open: false,
    exceedingHours: 0,
    totalHours: 0
  });
  const [pendingData, setPendingData] = useState(null);

  const { setError, setSuccess, clearField, clearAll, getFieldClass, getErrorMsg } = useFormValidation();
  const { activities, limiteDiario, actualizarLimite } = useActivities();

  useEffect(() => {
    if (!open) return;
    clearAll(SUB_FIELDS);
    setBannerMsg('');
    setConflictDialog({ open: false, exceedingHours: 0, totalHours: 0 });
    setPendingData(null);
    if (editingSubtask) {
      setNombre(editingSubtask.nombre || "");
      setFecha(editingSubtask.fecha_entrega || "");
      setHoras(editingSubtask.horas_estimadas || "");
    } else {
      setNombre(''); setFecha(''); setHoras('');
    }
    // eslint-disable-next-line
  }, [open, editingSubtask]);

  function validate(fieldId, vals = {}) {
    const n = vals.nombre ?? nombre;
    const f = vals.fecha ?? fecha;
    const h = vals.horas ?? horas;
    const parentFecha = parentActivity?.fecha;

    if (fieldId === 'sub-field-nombre') {
      if (!n) { setError(fieldId, 'El nombre de la subtarea no puede estar vacío.'); return false; }
      if (n.length < 3) { setError(fieldId, 'Nombre muy corto. Sé más descriptivo.'); return false; }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'sub-field-fecha') {
      if (!f) { setError(fieldId, 'Indica una fecha objetivo para esta subtarea.'); return false; }
      if (parentFecha && f > parentFecha) {
        setError(fieldId, `La fecha objetivo no puede ser posterior a la entrega (${formatDate(parentFecha)}).`);
        return false;
      }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'sub-field-horas') {
      const v = parseFloat(h);
      if (isNaN(v) || v <= 0) { setError(fieldId, 'Introduce las horas estimadas. Usa decimales si es menos de 1 hora (Ej: 0.5).'); return false; }
      if (v > 24) { setError(fieldId, '¿Más de 24 horas para una sola subtarea? Considera dividirla.'); return false; }
      setSuccess(fieldId); return true;
    }
    return true;
  }

  function handleSubmit() {
    const results = SUB_FIELDS.map(f => validate(f));
    const errCount = results.filter(r => !r).length;
    if (errCount > 0) {
      setBannerMsg(errCount === 1
        ? 'Hay 1 campo con un error. Corrígelo para continuar.'
        : `Hay ${errCount} campos con errores. Corrígelos para continuar.`);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    setBannerMsg('');
    
    // Validar límite diario
    const horasSubtarea = parseFloat(horas);
    const validacion = validarExcededeLimite(
      activities,
      fecha,
      horasSubtarea,
      limiteDiario,
      editingSubtask?.id
    );

    if (validacion.excede) {
      // Mostrar diálogo de conflicto
      setConflictDialog({
        open: true,
        exceedingHours: horasSubtarea,
        totalHours: validacion.totalHoras
      });
      setPendingData({
        nombre,
        fecha,
        horas: horasSubtarea
      });
      return;
    }

    // Sin conflicto, guardar directamente
    onSave({ nombre, fecha, horas: horasSubtarea });
  }

  function handleConflictIncreaseLimit() {
    // Cerrar el diálogo de conflicto
    setConflictDialog({ ...conflictDialog, open: false });
    // Mostrar diálogo para aumentar límite
    const nuevoLimite = Math.ceil(conflictDialog.totalHours * 1.1); // Aumentar 10% redondeado hacia arriba
    const response = confirm(
      `¿Deseas aumentar tu límite diario de ${limiteDiario}h a ${nuevoLimite}h?`
    );
    if (response) {
      actualizarLimite(nuevoLimite);
      // Guardar la subtarea
      if (pendingData) {
        onSave(pendingData);
      }
      setPendingData(null);
    }
  }

  function handleConflictReschedule() {
    // Cerrar el diálogo de conflicto
    setConflictDialog({ ...conflictDialog, open: false });
    // El usuario debe cambiar la fecha manualmente en el modal
    // Mostrar un mensaje indicando que debe cambiar la fecha
    setBannerMsg('Por favor, cambia la fecha de la subtarea a otro día con menos carga.');
  }

  function handleConflictCancel() {
    setConflictDialog({ ...conflictDialog, open: false });
    setPendingData(null);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <>
      <div className={`sub-overlay${open ? ' open' : ''}`} onClick={handleOverlayClick}>
        <div className={`sub-modal${shaking ? ' shake' : ''}`}>
          <h3>{editingSubtask ? 'Editar subtarea' : 'Nueva subtarea'}</h3>
          <p className="sub-parent">
            Actividad: <strong>{parentActivity?.titulo || '—'}</strong>
          </p>

          {bannerMsg && <div className="form-error-banner show">{bannerMsg}</div>}

          <div className={getFieldClass('sub-field-nombre')}>
            <label htmlFor="sf-nombre">Nombre <span style={{ color: 'var(--purple)' }}>*</span></label>
            <input
              type="text"
              id="sf-nombre"
              placeholder="Ej: Leer capítulo 3, Resolver ejercicios 4-10…"
              value={nombre}
              onChange={e => { setNombre(e.target.value); clearField('sub-field-nombre'); }}
              onBlur={() => validate('sub-field-nombre')}
            />
            <span className="field-hint">Sé específico: "Leer cap. 3" es mejor que "Estudiar".</span>
            <span className="field-error-msg">{getErrorMsg('sub-field-nombre')}</span>
          </div>

          <div className="sub-form-row">
            <div className={getFieldClass('sub-field-fecha')}>
              <label htmlFor="sf-fecha">Fecha objetivo <span style={{ color: 'var(--purple)' }}>*</span></label>
              <input
                type="date"
                id="sf-fecha"
                value={fecha}
                onChange={e => { setFecha(e.target.value); clearField('sub-field-fecha'); validate('sub-field-fecha', { fecha: e.target.value }); }}
                onBlur={() => validate('sub-field-fecha')}
              />
              <span className="field-hint">¿Cuándo quieres tenerla lista?</span>
              <span className="field-error-msg">{getErrorMsg('sub-field-fecha')}</span>
            </div>

            <div className={getFieldClass('sub-field-horas')}>
              <label htmlFor="sf-horas">Horas estimadas <span style={{ color: 'var(--purple)' }}>*</span></label>
              <input
                type="number"
                id="sf-horas"
                placeholder="Ej: 1.5"
                min="0.5"
                step="0.5"
                value={horas}
                onChange={e => { setHoras(e.target.value); clearField('sub-field-horas'); }}
                onBlur={() => validate('sub-field-horas')}
              />
              <span className="field-hint">Puedes usar decimales: 0.5, 1.5…</span>
              <span className="field-error-msg">{getErrorMsg('sub-field-horas')}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingSubtask ? 'Guardar cambios' : 'Añadir subtarea'}
            </button>
          </div>
        </div>
      </div>

      <HourlyLimitConflictDialog
        open={conflictDialog.open}
        exceedingHours={conflictDialog.exceedingHours}
        limitHours={limiteDiario}
        totalHours={conflictDialog.totalHours}
        onIncreaseLimit={handleConflictIncreaseLimit}
        onReschedule={handleConflictReschedule}
        onCancel={handleConflictCancel}
      />
    </>
  );
}
