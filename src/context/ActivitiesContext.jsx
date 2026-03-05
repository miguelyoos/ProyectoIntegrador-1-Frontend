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
      console.log("📤 Enviando subtarea:", subtask);
      console.log("📤 Para actividad ID:", activityId);
      
      const nueva = await crearSubtarea({
        nombre: subtask.nombre,
        fecha_entrega: subtask.fecha, // Backend espera 'fecha_entrega'
        horas_estimadas: subtask.horas, // Backend espera 'horas_estimadas'
        actividad: activityId, // Backend espera 'actividad' no 'actividadId'
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