import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { completionService } from '../services/habitService';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { TrendingUp, Calendar, Award, Flame } from 'lucide-react';

const StatsView = () => {
  const { habits } = useHabits();
  const [stats, setStats] = useState({});
  const [streaks, setStreaks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [habits]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsMap = {};
      const streaksMap = {};

      for (const habit of habits) {
        // Get 30-day statistics
        const habitStats = await completionService.getStatistics(habit.id, 30);
        statsMap[habit.id] = habitStats;

        // Calculate streak
        const streak = await completionService.calculateStreak(habit.id);
        streaksMap[habit.id] = streak;
      }

      setStats(statsMap);
      setStreaks(streaksMap);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin text-blue-500">Loading statistics...</div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No statistics yet
        </h3>
        <p className="text-gray-600">
          Create some habits and start tracking to see your progress!
        </p>
      </div>
    );
  }

  // Calculate overall stats
  const totalHabits = habits.length;
  const totalCompletionRate =
    Object.values(stats).reduce((sum, s) => sum + parseFloat(s.completionRate || 0), 0) /
    totalHabits;
  const totalCompletedDays = Object.values(stats).reduce(
    (sum, s) => sum + (s.completedDays || 0),
    0
  );
  const maxStreak = Math.max(...Object.values(streaks), 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm opacity-90">Total Habits</span>
          </div>
          <div className="text-3xl font-bold">{totalHabits}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} />
            <span className="text-sm opacity-90">Completion</span>
          </div>
          <div className="text-3xl font-bold">{totalCompletionRate.toFixed(0)}%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} />
            <span className="text-sm opacity-90">Completed</span>
          </div>
          <div className="text-3xl font-bold">{totalCompletedDays}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} />
            <span className="text-sm opacity-90">Best Streak</span>
          </div>
          <div className="text-3xl font-bold">{maxStreak}</div>
        </div>
      </div>

      {/* Individual Habit Stats */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Habit Details</h3>
        {habits.map((habit) => {
          const habitStats = stats[habit.id] || {};
          const habitStreak = streaks[habit.id] || 0;

          return (
            <div
              key={habit.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{habit.icon}</div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-1">{habit.name}</h4>
                  {habit.description && (
                    <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">30-Day Rate</div>
                      <div className="text-xl font-bold text-blue-600">
                        {habitStats.completionRate || 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Completed</div>
                      <div className="text-xl font-bold text-green-600">
                        {habitStats.completedDays || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Missed</div>
                      <div className="text-xl font-bold text-red-600">
                        {habitStats.missedDays || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Streak</div>
                      <div className="text-xl font-bold text-orange-600 flex items-center gap-1">
                        <Flame size={20} />
                        {habitStreak}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{habitStats.completedDays || 0} / {habitStats.totalDays || 30}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${habitStats.completionRate || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsView;
