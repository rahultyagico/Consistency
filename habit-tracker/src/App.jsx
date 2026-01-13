import { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import HabitList from './components/HabitList';
import AddHabitModal from './components/AddHabitModal';
import StatsView from './components/StatsView';
import Header from './components/Header';
import { Plus } from 'lucide-react';

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState('habits'); // 'habits' or 'stats'

  return (
    <HabitProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Header view={view} setView={setView} />

          <main className="mt-6">
            {view === 'habits' ? (
              <HabitList />
            ) : (
              <StatsView />
            )}
          </main>

          {/* Floating Action Button */}
          {view === 'habits' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
              aria-label="Add new habit"
            >
              <Plus size={24} />
            </button>
          )}

          {/* Add Habit Modal */}
          <AddHabitModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </div>
      </div>
    </HabitProvider>
  );
}

export default App;
