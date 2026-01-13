import { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import HabitCard from './HabitCard';
import EditHabitModal from './EditHabitModal';
import { Loader2 } from 'lucide-react';

const HabitList = () => {
  const { habits, loading, error } = useHabits();
  const [editingHabit, setEditingHabit] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">Error loading habits</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <p className="text-gray-600 text-sm mt-4">
          Make sure you've configured your Supabase credentials in the .env file
        </p>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No habits yet
        </h3>
        <p className="text-gray-600">
          Click the + button to create your first habit and start building consistency!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={() => setEditingHabit(habit)}
            delay={index * 50}
          />
        ))}
      </div>

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </>
  );
};

export default HabitList;
