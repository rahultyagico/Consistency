import { createContext, useContext, useState, useEffect } from 'react';
import { habitService, completionService } from '../services/habitService';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load habits on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitService.getHabits();
      setHabits(data || []);

      // Load today's completions
      await loadTodayCompletions(data || []);
    } catch (err) {
      console.error('Error loading habits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayCompletions = async (habitsList) => {
    try {
      const today = new Date();
      const completionsMap = {};

      for (const habit of habitsList) {
        const isCompleted = await completionService.isHabitCompleted(habit.id, today);
        completionsMap[habit.id] = isCompleted;
      }

      setCompletions(completionsMap);
    } catch (err) {
      console.error('Error loading completions:', err);
    }
  };

  const addHabit = async (habitData) => {
    try {
      const newHabit = await habitService.createHabit({
        ...habitData,
        order_index: habits.length
      });
      setHabits([...habits, newHabit]);
      setCompletions({ ...completions, [newHabit.id]: false });
      return newHabit;
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const updateHabit = async (id, updates) => {
    try {
      const updated = await habitService.updateHabit(id, updates);
      setHabits(habits.map(h => h.id === id ? updated : h));
      return updated;
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(habits.filter(h => h.id !== id));
      const newCompletions = { ...completions };
      delete newCompletions[id];
      setCompletions(newCompletions);
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  const toggleHabitCompletion = async (habitId) => {
    try {
      const today = new Date();
      await completionService.toggleCompletion(habitId, today);

      setCompletions({
        ...completions,
        [habitId]: !completions[habitId]
      });
    } catch (err) {
      console.error('Error toggling completion:', err);
      throw err;
    }
  };

  const value = {
    habits,
    completions,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    refreshHabits: loadHabits
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
