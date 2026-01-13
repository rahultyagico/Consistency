import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { MoreVertical, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

const HabitCard = ({ habit, onEdit, delay = 0 }) => {
  const { completions, toggleHabitCompletion, deleteHabit } = useHabits();
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isCompleted = completions[habit.id] || false;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), delay);
  }, [delay]);

  const handleToggle = async () => {
    setIsAnimating(true);
    try {
      await toggleHabitCompletion(habit.id);
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(habit.id);
      } catch (err) {
        console.error('Error deleting habit:', err);
      }
    }
    setShowMenu(false);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isCompleted ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Completion Button */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 transition-all duration-300 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2
              size={32}
              className="text-green-500 animate-bounce-subtle"
              strokeWidth={2}
            />
          ) : (
            <Circle
              size={32}
              className="text-gray-300 hover:text-blue-500 transition-colors"
              strokeWidth={2}
            />
          )}
        </button>

        {/* Habit Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{habit.icon}</span>
            <h3
              className={`font-semibold text-lg transition-all ${
                isCompleted
                  ? 'text-gray-400 line-through'
                  : 'text-gray-900'
              }`}
            >
              {habit.name}
            </h3>
          </div>
          {habit.description && (
            <p className="text-gray-600 text-sm mt-1 truncate">
              {habit.description}
            </p>
          )}
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={20} className="text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isCompleted && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-fade-in" />
        </div>
      )}
    </div>
  );
};

export default HabitCard;
