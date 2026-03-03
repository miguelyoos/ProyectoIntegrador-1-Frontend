import React, { createContext, useContext, useState } from 'react';

const ActivitiesContext = createContext(null);

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());

  function addActivity(data) {
    setActivities(prev => [...prev, { id: Date.now(), subtasks: [], ...data }]);
  }

  function updateActivity(id, data) {
    setActivities(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
  }

  function deleteActivity(id) {
    setActivities(prev => prev.filter(a => a.id !== id));
  }

  function toggleExpand(id) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addSubtask(activityId, subtask) {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? { ...a, subtasks: [...(a.subtasks || []), { id: Date.now(), done: false, ...subtask }] }
          : a
      )
    );
    setExpandedCards(prev => new Set(prev).add(activityId));
  }

  function updateSubtask(activityId, subtaskId, data) {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? {
              ...a,
              subtasks: (a.subtasks || []).map(s =>
                s.id === subtaskId ? { ...s, ...data } : s
              ),
            }
          : a
      )
    );
  }

  function deleteSubtask(activityId, subtaskId) {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? { ...a, subtasks: (a.subtasks || []).filter(s => s.id !== subtaskId) }
          : a
      )
    );
  }

  function toggleSubtask(activityId, subtaskId) {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId
          ? {
              ...a,
              subtasks: (a.subtasks || []).map(s =>
                s.id === subtaskId ? { ...s, done: !s.done } : s
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
