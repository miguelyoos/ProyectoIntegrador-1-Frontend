import React, { createContext, useContext, useState, useEffect } from "react";

import {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
} from "../services/actividadesService";

import {
  crearSubtarea,
} from "../services/subtareasService";

import { calcEstado } from "../utils/helpers";

const ActivitiesContext = createContext(null);

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());

  // 🔹 Cargar actividades y sus subtareas
  useEffect(() => {
    let cancelled = false;

    async function cargarActividades() {
      console.log("Cargando actividades...");
      try {
        const acts = await obtenerActividades();
        
        if (cancelled) return; // No actualizar si el componente se desmontó
        
        console.log("🔍 Actividades recibidas:", acts);

        // Las subtareas ya vienen incluidas en la respuesta del backend
        // Recalcular el estado basado en horasComp y horasEst
        const actsConSubtareas = acts.map((a) => ({
          ...a,
          subtasks: a.subtareas || a.subtasks || [],
          estado: calcEstado(a.horasComp, a.horasEst)
        }));

        setActivities(actsConSubtareas);
      } catch (error) {
        if (!cancelled) {
          console.error("Error cargando actividades", error);
        }
      }
    }

    cargarActividades();

    return () => {
      cancelled = true; // Cancelar si el componente se desmonta
    };
  }, []);

  // 🔹 Crear actividad
  async function addActivity(data) {
    try {
      const nueva = await crearActividad(data);

      setActivities((prev) => [
        ...prev,
        { 
          ...nueva, 
          subtasks: [],
          estado: calcEstado(nueva.horasComp, nueva.horasEst)
        }
      ]);
    } catch (error) {
      console.error("Error creando actividad", error);
    }
  }
  

  // 🔹 Actualizar actividad
  async function updateActivity(id, data) {
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
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  }

  // 🔹 Eliminar actividad
  async function deleteActivity(id) {
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
  try {
    const nueva = await crearSubtarea({
      ...subtask,
      actividadId: activityId,
    });

    const subtaskConId = {
      ...nueva,
      id: nueva.id || crypto.randomUUID(),
      done: nueva.done ?? false,
    };

    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              subtasks: [...(a.subtasks || []), subtaskConId],
            }
          : a
      )
    );

    setExpandedCards((prev) => new Set(prev).add(activityId));

  } catch (error) {
    console.error("Error creando subtarea", error);
  }
}

  // 🔹 Actualizar subtarea (local)
  function updateSubtask(activityId, subtaskId, data) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              subtasks: (a.subtasks || []).map((s) =>
                s.id === subtaskId ? { ...s, ...data } : s
              ),
            }
          : a
      )
    );
  }

  // 🔹 Eliminar subtarea (local)
  function deleteSubtask(activityId, subtaskId) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              subtasks: (a.subtasks || []).filter(
                (s) => s.id !== subtaskId
              ),
            }
          : a
      )
    );
  }

  // 🔹 Toggle estado subtarea
  function toggleSubtask(activityId, subtaskId) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? {
              ...a,
              subtasks: (a.subtasks || []).map((s) =>
                s.id === subtaskId
                  ? { ...s, done: !s.done }
                  : s
              ),
            }
          : a
      )
    );
  }

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        expandedCards,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleExpand,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtask,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  return useContext(ActivitiesContext);
}