import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

// Habits CRUD operations
export const habitService = {
  // Get all active habits
  async getHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get single habit
  async getHabit(id) {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new habit
  async createHabit(habit) {
    const { data, error } = await supabase
      .from('habits')
      .insert([habit])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update habit
  async updateHabit(id, updates) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete habit (soft delete)
  async deleteHabit(id) {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Hard delete habit
  async hardDeleteHabit(id) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Reorder habits
  async reorderHabits(habits) {
    const updates = habits.map((habit, index) => ({
      id: habit.id,
      order_index: index
    }));

    const { error } = await supabase
      .from('habits')
      .upsert(updates);

    if (error) throw error;
  }
};

// Habit Completions CRUD operations
export const completionService = {
  // Get completions for a habit
  async getHabitCompletions(habitId, startDate, endDate) {
    let query = supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', format(startDate, 'yyyy-MM-dd'));
    }
    if (endDate) {
      query = query.lte('date', format(endDate, 'yyyy-MM-dd'));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get all completions for a date range
  async getCompletions(startDate, endDate) {
    let query = supabase
      .from('habit_completions')
      .select('*, habits(*)')
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', format(startDate, 'yyyy-MM-dd'));
    }
    if (endDate) {
      query = query.lte('date', format(endDate, 'yyyy-MM-dd'));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Check if habit is completed on a specific date
  async isHabitCompleted(habitId, date) {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', format(date, 'yyyy-MM-dd'))
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Toggle habit completion
  async toggleCompletion(habitId, date, notes = null) {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Check if already completed
    const { data: existing } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', dateStr)
      .single();

    if (existing) {
      // Remove completion
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id);

      if (error) throw error;
      return null;
    } else {
      // Add completion
      const { data, error } = await supabase
        .from('habit_completions')
        .insert([{
          habit_id: habitId,
          date: dateStr,
          notes
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Calculate streak for a habit
  async calculateStreak(habitId) {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('date')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < data.length; i++) {
      const completionDate = new Date(data[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },

  // Get completion statistics
  async getStatistics(habitId, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (error) throw error;

    const totalDays = days;
    const completedDays = data.length;
    const completionRate = ((completedDays / totalDays) * 100).toFixed(1);

    return {
      totalDays,
      completedDays,
      completionRate,
      missedDays: totalDays - completedDays
    };
  }
};
