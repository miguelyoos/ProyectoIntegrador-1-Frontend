import { useEffect, useRef } from 'react';

function getRoleName(element) {
  const explicitRole = element.getAttribute('role');
  if (explicitRole) return explicitRole;

  const tag = element.tagName.toLowerCase();
  if (tag === 'button') return 'boton';
  if (tag === 'a') return 'enlace';
  if (tag === 'input') {
    const type = (element.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox') return 'casilla';
    if (type === 'radio') return 'opcion';
    if (type === 'date') return 'selector de fecha';
    if (type === 'number') return 'campo numerico';
    if (type === 'password') return 'campo de contrasena';
    return 'campo de texto';
  }
  if (tag === 'select') return 'lista desplegable';
  if (tag === 'textarea') return 'area de texto';

  return 'elemento';
}

function getElementText(element) {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelNode = document.getElementById(labelledBy);
    const labelledText = labelNode?.textContent?.trim();
    if (labelledText) return labelledText;
  }

  if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'select') {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      const labelText = label?.textContent?.trim();
      if (labelText) return labelText;
    }

    const placeholder = element.getAttribute('placeholder');
    if (placeholder) return placeholder.trim();
  }

  const title = element.getAttribute('title');
  if (title) return title.trim();

  const text = element.textContent?.replace(/\s+/g, ' ').trim();
  if (text) return text.slice(0, 90);

  return 'sin etiqueta';
}

function getStateText(element) {
  const chunks = [];

  const expanded = element.getAttribute('aria-expanded');
  if (expanded === 'true') chunks.push('expandido');
  if (expanded === 'false') chunks.push('colapsado');

  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox' || element.type === 'radio') {
      chunks.push(element.checked ? 'seleccionado' : 'no seleccionado');
    }

    if (element.disabled) chunks.push('deshabilitado');
    if (element.required) chunks.push('requerido');
  }

  if (element instanceof HTMLButtonElement && element.disabled) {
    chunks.push('deshabilitado');
  }

  return chunks.join(', ');
}

function getVoice(voices) {
  return (
    voices.find(v => v.lang.toLowerCase().startsWith('es-cl')) ||
    voices.find(v => v.lang.toLowerCase().startsWith('es-es')) ||
    voices.find(v => v.lang.toLowerCase().startsWith('es')) ||
    null
  );
}

export default function KeyboardVoiceAnnouncer() {
  const tabNavigationRef = useRef(false);
  const lastMessageRef = useRef('');
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    function speak(message) {
      const now = Date.now();
      if (!message) return;
      if (message === lastMessageRef.current && now - lastTimeRef.current < 500) return;

      lastMessageRef.current = message;
      lastTimeRef.current = now;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;

      const voice = getVoice(window.speechSynthesis.getVoices());
      if (voice) utterance.voice = voice;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    function onKeyDown(event) {
      tabNavigationRef.current = event.key === 'Tab';
    }

    function onMouseDown() {
      tabNavigationRef.current = false;
    }

    function onFocusIn(event) {
      if (!tabNavigationRef.current) return;

      const element = event.target;
      if (!(element instanceof HTMLElement)) return;

      const role = getRoleName(element);
      const text = getElementText(element);
      const state = getStateText(element);

      const message = state ? `${text}, ${role}, ${state}` : `${text}, ${role}`;
      speak(message);
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('focusin', onFocusIn, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('focusin', onFocusIn, true);
      window.speechSynthesis.cancel();
    };
  }, []);

  return null;
}
