import { format } from 'date-fns';
import { TrendingUp, Target } from 'lucide-react';

const Header = ({ view, setView }) => {
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <header className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Consistency
          </h1>
          <p className="text-gray-600 mt-1">{today}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setView('habits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'habits'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Target size={18} />
          Habits
        </button>
        <button
          onClick={() => setView('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'stats'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={18} />
          Statistics
        </button>
      </div>
    </header>
  );
};

export default Header;
