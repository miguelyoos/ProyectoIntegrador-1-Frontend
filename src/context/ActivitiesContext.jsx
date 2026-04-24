import React, { createContext, useContext, useState, useEffect } from "react";

import {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "../services/actividadesService";

import {
  crearSubtarea,
  editarSubtarea,
  eliminarSubtarea,
} from "../services/subtareasService";

import { obtenerPerfil, actualizarLimite } from "../services/profileService";

import { calcEstado } from "../utils/helpers";

const MOCK_DATA = [
  {
    id: 1,
    titulo: "Examen de Cálculo",
    materia: "Matemáticas",
    fecha: "2026-04-20",
    prioridad: "Alta",
    estado: "pendiente",
    horasEst: 5,
    horasComp: 2,
    subtasks: [
      { id: 1, nombre: "Repasar límites", fecha_entrega: "2026-04-18", horas_estimadas: 2, done: false },
      { id: 2, nombre: "Hacer ejercicios derivadas", fecha_entrega: "2026-04-19", horas_estimadas: 3, done: true }
    ]
  },
  {
    id: 2,
    titulo: "Proyecto Final",
    materia: "Programación",
    fecha: "2026-04-25",
    prioridad: "Media",
    estado: "progreso",
    horasEst: 10,
    horasComp: 4,
    subtasks: [
      { id: 3, nombre: "Diseñar base de datos", fecha_entrega: "2026-04-22", horas_estimadas: 4, done: true },
      { id: 4, nombre: "Implementar API", fecha_entrega: "2026-04-24", horas_estimadas: 6, done: false }
    ]
  },
  {
    id: 3,
    titulo: "Ensayo Historia",
    materia: "Historia",
    fecha: "2026-04-15",
    prioridad: "Baja",
    estado: "completada",
    horasEst: 3,
    horasComp: 3,
    subtasks: []
  }
];

const ActivitiesContext = createContext(null);

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [limiteDiario, setLimiteDiario] = useState(6); // Valor por defecto: 6 horas

  // 🔹 Cargar actividades y su límite diario
  useEffect(() => {
    let cancelled = false;

    async function cargarDatos() {
      console.log("🔍 Cargando actividades...");
      try {
        // Cargar perfil para obtener límite diario
        try {
          const perfil = await obtenerPerfil();
          if (!cancelled && perfil.limite_diario_horas) {
            setLimiteDiario(Number(perfil.limite_diario_horas));
          }
        } catch (error) {
          console.log("⚠️ No se pudo cargar el perfil, usando límite por defecto");
        }

        const acts = await obtenerActividades();
        
        if (cancelled) return;
        
        console.log("🔍 Actividades recibidas:", acts);

        const actsConSubtareas = acts.map((a) => ({
          ...a,
          subtasks: a.subtareas || a.subtasks || [],
          estado: calcEstado(a.horasComp, a.horasEst)
        }));

        setActivities(actsConSubtareas);
      } catch (error) {
        console.log("⚠️ Backend no disponible, usando modo local...");
        if (!cancelled) {
          setIsLocalMode(true);
          localStorage.setItem("localMode", "true");
          const stored = localStorage.getItem('localActivities');
          if (stored) {
            setActivities(JSON.parse(stored));
          } else {
            setActivities(MOCK_DATA);
            localStorage.setItem('localActivities', JSON.stringify(MOCK_DATA));
          }
          // Límite por defecto en modo local
          setLimiteDiario(6);
        }
      }
    }

    cargarDatos();

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 Crear actividad
  async function addActivity(data) {
    if (isLocalMode) {
      const newId = Date.now();
      const nueva = {
        id: newId,
        titulo: data.titulo,
        materia: data.materia,
        fecha: data.fecha,
        prioridad: data.prioridad,
        tipo: data.tipo,
        estado: 'pendiente',
        horasEst: data.horasEst || 0,
        horasComp: 0,
        subtasks: []
      };
      setActivities((prev) => {
        const updated = [...prev, nueva];
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return nueva;
    }

    try {
      const nueva = await crearActividad(data);

      const actividadConSubtareas = { 
        ...nueva, 
        subtasks: [],
        estado: calcEstado(nueva.horasComp, nueva.horasEst)
      };

      setActivities((prev) => [
        ...prev,
        actividadConSubtareas
      ]);

      return actividadConSubtareas;
    } catch (error) {
      console.error("Error creando actividad", error);
    }
  }
  

  // 🔹 Actualizar actividad
  async function updateActivity(id, data) {
    if (isLocalMode) {
      setActivities((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, ...data } : a));
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const actualizada = await actualizarActividad(id, data);

      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { 
          ...a, 
          ...actualizada,
          estado: calcEstado(actualizada.horasComp, actualizada.horasEst)
        } : a))
      );
    } catch (error) {
      console.error("Error actualizando actividad", error);
      console.error("Detalles del error:", error.response?.data);
      throw error;
    }
  }

  // 🔹 Eliminar actividad
  async function deleteActivity(id) {
    if (isLocalMode) {
      setActivities((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      await eliminarActividad(id);

      setActivities((prev) =>
        prev.filter((a) => a.id !== id)
      );
    } catch (error) {
      console.error("Error eliminando actividad", error);
    }
  }

  // 🔹 Expandir / colapsar card
  function toggleExpand(id) {
    setExpandedCards((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  // 🔹 Crear subtarea
  async function addSubtask(activityId, subtask) {
    if (isLocalMode) {
      const newId = Date.now();
      const nueva = {
        id: newId,
        nombre: subtask.nombre,
        fecha_entrega: subtask.fecha,
        horas_estimadas: subtask.horas,
        done: false
      };
      setActivities((prev) => {
        const updated = prev.map((a) =>
          a.id === activityId
            ? { ...a, subtasks: [...(a.subtasks || []), nueva] }
            : a
        );
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      setExpandedCards((prev) => new Set(prev).add(activityId));
      return;
    }

    try {
      console.log("📤 Enviando subtarea:", subtask);
      console.log("📤 Para actividad ID:", activityId);
      
      const nueva = await crearSubtarea({
        nombre: subtask.nombre,
        fecha_entrega: subtask.fecha,
        horas_estimadas: subtask.horas,
        actividad: activityId,
      });

      console.log("✅ Subtarea creada:", nueva);

      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                subtasks: [...(a.subtasks || []), nueva],
              }
            : a
        )
      );

      setExpandedCards((prev) => new Set(prev).add(activityId));
    } catch (error) {
      console.error("❌ Error creando subtarea", error);
      console.error("Detalles:", error.response?.data);
      throw error;
    }
  }

  // 🔹 Actualizar subtarea (local)
  async function updateSubtask(activityId, subtaskId, data) {
    if (isLocalMode) {
      setActivities((prev) => {
        const updated = prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                subtasks: (a.subtasks || []).map((s) =>
                  s.id === subtaskId ? { ...s, ...data } : s
                ),
              }
            : a
        );
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    try {
      const actualizada = await editarSubtarea(subtaskId, data);

      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId
            ? {
                ...a,
                subtasks: (a.subtasks || []).map((s) =>
                  s.id === subtaskId ? { ...s, ...actualizada } : s
                ),
              }
            : a
        )
      );
    } catch (error) {
      console.error("Error actualizando subtarea", error);
    }
  }

  const deleteSubtask = async (activityId, subtaskId) => {
    if (isLocalMode) {
      setActivities((prev) => {
        const updated = prev.map((a) =>
          a.id === activityId
            ? { ...a, subtasks: a.subtasks.filter(s => s.id !== subtaskId) }
            : a
        );
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    await eliminarSubtarea(subtaskId);

    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? {
              ...act,
              subtasks: act.subtasks.filter(s => s.id !== subtaskId)
            }
          : act
      )
    );
  };

  // 🔹 Toggle estado subtarea
  const toggleSubtask = async (activityId, subtaskId) => {
    const activity = activities.find(a => a.id === activityId);
    const sub = activity.subtasks.find(s => s.id === subtaskId);

    if (isLocalMode) {
      setActivities((prev) => {
        const updated = prev.map((act) =>
          act.id === activityId
            ? {
                ...act,
                subtasks: act.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, done: !s.done } : s
                ),
              }
            : act
        );
        localStorage.setItem('localActivities', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    const updated = await editarSubtarea(subtaskId, {
      done: !sub.done
    });

    setActivities(prev =>
      prev.map(act =>
        act.id === activityId
          ? {
              ...act,
              subtasks: act.subtasks.map(s =>
                s.id === subtaskId ? updated : s
              )
            }
          : act
      )
    );
  };

    return (
    <ActivitiesContext.Provider
      value={{
        activities,
        expandedCards,
        limiteDiario,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleExpand,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtask,
        actualizarLimite: async (nuevoLimite) => {
          if (isLocalMode) {
            setLimiteDiario(nuevoLimite);
            return;
          }
          try {
            const response = await actualizarLimite(nuevoLimite);
            if (response.profile?.limite_diario_horas) {
              setLimiteDiario(Number(response.profile.limite_diario_horas));
            }
          } catch (error) {
            console.error("Error actualizando límite:", error);
          }
        }
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  return useContext(ActivitiesContext);
}