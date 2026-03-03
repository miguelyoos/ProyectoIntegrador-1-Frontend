import { useState, useCallback } from 'react';

export function useFormValidation() {
  const [fieldStates, setFieldStates] = useState({});

  const setError = useCallback((fieldId, message) => {
    setFieldStates(prev => ({ ...prev, [fieldId]: { status: 'error', message } }));
  }, []);

  const setSuccess = useCallback((fieldId) => {
    setFieldStates(prev => ({ ...prev, [fieldId]: { status: 'success', message: '' } }));
  }, []);

  const clearField = useCallback((fieldId) => {
    setFieldStates(prev => ({ ...prev, [fieldId]: { status: '', message: '' } }));
  }, []);

  const clearAll = useCallback((fieldIds) => {
    const reset = {};
    fieldIds.forEach(id => { reset[id] = { status: '', message: '' }; });
    setFieldStates(reset);
  }, []);

  const getFieldClass = (fieldId) => {
    const s = fieldStates[fieldId];
    if (!s) return 'field';
    if (s.status === 'error') return 'field field-error';
    if (s.status === 'success') return 'field field-success';
    return 'field';
  };

  const getErrorMsg = (fieldId) => {
    return fieldStates[fieldId]?.message || '';
  };

  return { setError, setSuccess, clearField, clearAll, getFieldClass, getErrorMsg };
}
