import TareaItem from './TareaItem';

export default function GrupoTareas({ titulo, tareas, onUpdate }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.25rem', fontWeight: '600' }}>{titulo}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tareas.map(tarea => (
          <TareaItem key={tarea.id} tarea={tarea} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
