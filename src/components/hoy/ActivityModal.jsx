import React, { useState, useEffect, useRef } from 'react';
import { calcEstado } from '../../utils/helpers';
import { useFormValidation } from '../../hooks/useFormValidation';
import './ActivityModal.css';

const FIELDS = ['field-titulo', 'field-materia', 'field-fecha', 'field-horas-est', 'field-horas-comp'];

function SpinnerField({ id, value, min, onChange, onValidate }) {
  return (
    <div className="spinner-wrap">
      <input
        type="number"
        id={id}
        value={value}
        min={min}
        onChange={e => onChange(Number(e.target.value))}
        onInput={onValidate}
      />
      <div className="spin-btns">
        <button type="button" onClick={() => onChange(v => Math.max(min, v + 1))}>▲</button>
        <button type="button" onClick={() => onChange(v => Math.max(min, v - 1))}>▼</button>
      </div>
    </div>
  );
}

export default function ActivityModal({ open, editingActivity, onClose, onSave, limiteDiario, horasActuales }) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('Tarea');
  const [materia, setMateria] = useState('');
  const [desc, setDesc] = useState('');
  const [fecha, setFecha] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [horasEst, setHorasEst] = useState(2);
  const [horasComp, setHorasComp] = useState(0);

  const [bannerMsg, setBannerMsg] = useState('');
  const [shaking, setShaking] = useState(false);
  const modalRef = useRef(null);

  const { setError, setSuccess, clearField, clearAll, getFieldClass, getErrorMsg } = useFormValidation();

  useEffect(() => {
    if (!open) return;
    clearAll(FIELDS);
    setBannerMsg('');
    if (editingActivity) {
      setTitulo(editingActivity.titulo);
      setTipo(editingActivity.tipo);
      setMateria(editingActivity.materia);
      setDesc(editingActivity.desc || '');
      setFecha(editingActivity.fecha);
      setPrioridad(editingActivity.prioridad);
      setHorasEst(editingActivity.horasEst);
      setHorasComp(editingActivity.horasComp);
    } else {
      setTitulo(''); setTipo('Tarea'); setMateria(''); setDesc('');
      setFecha(''); setPrioridad('Media'); setHorasEst(2); setHorasComp(0);
    }
    // eslint-disable-next-line
  }, [open, editingActivity]);

  function validate(fieldId, vals = {}) {
    const t = vals.titulo ?? titulo;
    const m = vals.materia ?? materia;
    const f = vals.fecha ?? fecha;
    const he = vals.horasEst ?? horasEst;
    const hc = vals.horasComp ?? horasComp;

    if (fieldId === 'field-titulo') {
      if (!t) { setError(fieldId, 'El título no puede estar vacío.'); return false; }
      if (t.length < 3) { setError(fieldId, 'El título es muy corto. Escribe al menos 3 caracteres.'); return false; }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'field-materia') {
      if (!m) { setError(fieldId, 'Indica la materia a la que pertenece esta actividad.'); return false; }
      if (m.length < 2) { setError(fieldId, 'Nombre de materia muy corto.'); return false; }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'field-fecha') {
      if (!f) { setError(fieldId, 'Selecciona la fecha de entrega.'); return false; }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'field-horas-est') {
      if (!he || he < 1) { setError(fieldId, 'Las horas estimadas deben ser al menos 1.'); return false; }
      setSuccess(fieldId); return true;
    }
    if (fieldId === 'field-horas-comp') {
      if (hc < 0) { setError(fieldId, 'Las horas completadas no pueden ser negativas.'); return false; }
      if (hc > he && he > 0) { setError(fieldId, 'Las horas completadas no pueden superar las estimadas.'); return false; }
      clearField(fieldId); return true;
    }
    return true;
  }

  function handleSubmit() {
    const results = FIELDS.map(f => validate(f));
    const errCount = results.filter(r => !r).length;
    if (errCount > 0) {
      setBannerMsg(errCount === 1
        ? 'Hay 1 campo con un error. Corrígelo para continuar.'
        : `Hay ${errCount} campos con errores. Corrígelos para continuar.`);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }

    // Validar límite diario de horas
    if (limiteDiario && !editingActivity) {
      const horasNuevas = Number(horasEst);
      const horasActualesNum = Number(horasActuales) || 0;
      const t = new Date();
      const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      
      if (fecha === todayStr && (horasActualesNum + horasNuevas) > limiteDiario) {
        setBannerMsg(`No puedes crear esta actividad. Tenés ${horasActualesNum}h activas hoy y con ${horasNuevas}h más superarías tu límite diario de ${limiteDiario}h.`);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        return;
      }
    }

    // Validar límite al editar si cambia fecha a hoy o cambia horas
    if (limiteDiario && editingActivity) {
      const horasNuevas = Number(horasEst);
      const horasViejas = Number(editingActivity.horasEst) || 0;
      const horasActualesNum = Number(horasActuales) || 0;
      const t = new Date();
      const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      
      if (fecha === todayStr) {
        const horasSinEsta = editingActivity.fecha === todayStr ? horasActualesNum - horasViejas : horasActualesNum;
        if ((horasSinEsta + horasNuevas) > limiteDiario) {
          setBannerMsg(`No puedes asignar ${horasNuevas}h. Con las actividades actuales (${horasSinEsta}h) superarías tu límite diario de ${limiteDiario}h.`);
          setShaking(true);
          setTimeout(() => setShaking(false), 400);
          return;
        }
      }
    }

    setBannerMsg('');
    onSave({
      titulo, tipo, materia, desc, fecha, prioridad,
      horasEst: Number(horasEst), horasComp: Number(horasComp),
      estado: calcEstado(Number(horasComp), Number(horasEst)),
    });
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={`overlay${open ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className={`modal${shaking ? ' shake' : ''}`} ref={modalRef}>
        <h2>{editingActivity ? 'Editar actividad' : 'Nueva actividad evaluativa'}</h2>

        {bannerMsg && <div className="form-error-banner show">{bannerMsg}</div>}

        <div className={getFieldClass('field-titulo')}>
          <label htmlFor="f-titulo">Título <span className="label-required">*</span></label>
          <input
            type="text"
            id="f-titulo"
            placeholder="Ej: Examen de Matemáticas, Taller de Geometría"
            value={titulo}
            onChange={e => { setTitulo(e.target.value); clearField('field-titulo'); }}
            onBlur={() => validate('field-titulo')}
          />
          <span className="field-hint">Dale un nombre claro para identificarlo rápidamente.</span>
          <span className="field-error-msg">{getErrorMsg('field-titulo')}</span>
        </div>

        <div className="form-row">
          <div className={getFieldClass('field-tipo')}>
            <label htmlFor="f-tipo">Tipo <span className="label-required">*</span></label>
            <div className="select-wrap">
              <select id="f-tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                {['Tarea', 'Examen', 'Taller', 'Proyecto', 'Quiz'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={getFieldClass('field-materia')}>
            <label htmlFor="f-materia">Materia <span className="label-required">*</span></label>
            <input
              type="text"
              id="f-materia"
              placeholder="Ej: Matemáticas, Física…"
              value={materia}
              onChange={e => { setMateria(e.target.value); clearField('field-materia'); }}
              onBlur={() => validate('field-materia')}
            />
            <span className="field-error-msg">{getErrorMsg('field-materia')}</span>
          </div>
        </div>

        <div className={getFieldClass('field-desc')}>
          <label htmlFor="f-desc">Descripción</label>
          <textarea
            id="f-desc"
            placeholder="Temas a cubrir, recursos necesarios, instrucciones del profesor…"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <span className="field-hint">Opcional. Añade contexto para no olvidar detalles importantes.</span>
        </div>

        <div className="form-row">
          <div className={getFieldClass('field-fecha')}>
            <label htmlFor="f-fecha">Fecha de entrega <span className="label-required">*</span></label>
            <input
              type="date"
              id="f-fecha"
              value={fecha}
              onChange={e => { setFecha(e.target.value); clearField('field-fecha'); validate('field-fecha', { fecha: e.target.value }); }}
              onBlur={() => validate('field-fecha')}
            />
            <span className="field-hint">¿Cuándo tienes que entregarlo?</span>
            <span className="field-error-msg">{getErrorMsg('field-fecha')}</span>
          </div>

          <div className={getFieldClass('field-prioridad')}>
            <label htmlFor="f-prioridad">Prioridad <span className="label-required">*</span></label>
            <div className="select-wrap">
              <select id="f-prioridad" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
                {['Baja', 'Media', 'Alta', 'Urgente'].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className={getFieldClass('field-horas-est')}>
            <label>Horas estimadas <span className="label-required">*</span></label>
            <SpinnerField
              id="f-horas-est"
              value={horasEst}
              min={1}
              onChange={v => {
                const val = typeof v === 'function' ? v(horasEst) : v;
                setHorasEst(val);
                clearField('field-horas-est');
                if (horasComp > val && val > 0) setError('field-horas-comp', 'Las horas completadas no pueden superar las estimadas.');
                else clearField('field-horas-comp');
              }}
              onValidate={() => validate('field-horas-est')}
            />
            <span className="field-hint">Tiempo total que crees que te llevará.</span>
            <span className="field-error-msg">{getErrorMsg('field-horas-est')}</span>
          </div>

          <div className={getFieldClass('field-horas-comp')}>
            <label>Horas completadas</label>
            <SpinnerField
              id="f-horas-comp"
              value={horasComp}
              min={0}
              onChange={v => {
                const val = typeof v === 'function' ? v(horasComp) : v;
                setHorasComp(val);
                if (val > horasEst && horasEst > 0) setError('field-horas-comp', 'Las horas completadas no pueden superar las estimadas.');
                else clearField('field-horas-comp');
              }}
              onValidate={() => validate('field-horas-comp')}
            />
            <span className="field-hint">Cuántas horas llevas trabajadas.</span>
            <span className="field-error-msg">{getErrorMsg('field-horas-comp')}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editingActivity ? 'Guardar cambios' : 'Crear actividad'}
          </button>
        </div>
      </div>
    </div>
  );
}
