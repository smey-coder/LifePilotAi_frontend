import React, { useEffect, useState } from 'react';
import { CheckCircle2, Flame, Calendar, Sparkles, Plus, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const DashboardUser = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch Dashboard Data from Laravel API
  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard/user');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Handle Habit Toggle (Check/Uncheck)
  const handleToggleHabit = async (habitId) => {
    setTogglingId(habitId);
    try {
      const response = await api.post(`/habits/${habitId}/toggle`);
      if (response.data.success) {
        // Re-fetch dashboard data to calculate updated streaks & percentages
        await fetchDashboard();
      }
    } catch (err) {
      console.error("Failed to toggle habit status:", err);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 dark:text-neutral-400">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading your LifePilot dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  const { user, metrics, habits, ai_suggestion } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-black border border-indigo-500/20 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            LifePilot AI Assistant
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-neutral-300 mt-1 max-w-xl">
            You have completed {metrics?.completed_habits} of {metrics?.total_habits} scheduled habits today. Keep up your {metrics?.streak_days}-day streak!
          </p>
        </div>
      </div>

      {/* Dynamic Daily Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Habit Completion</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics?.habit_completion_rate}%
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Active Streak</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics?.streak_days} Days
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Flame size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">Tasks Due Today</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics?.pending_tasks_today} Pending
            </p>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Habits & Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Checklist */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Habits</h2>
            <button className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl transition">
              <Plus size={14} /> New Habit
            </button>
          </div>

          <div className="space-y-3">
            {habits && habits.length > 0 ? (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800/80 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={habit.completed}
                      disabled={togglingId === habit.id}
                      onChange={() => handleToggleHabit(habit.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer disabled:opacity-50"
                    />
                    <span
                      className={`text-sm ${
                        habit.completed
                          ? "line-through text-slate-400 dark:text-neutral-500"
                          : "text-slate-800 dark:text-neutral-200 font-medium"
                      }`}
                    >
                      {habit.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700/60 capitalize">
                      {habit.frequency}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <Flame size={12} /> {habit.streak_count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-neutral-500 py-4 text-center">
                No habits configured for today yet.
              </p>
            )}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">AI Suggestions</h2>
          <div className="p-4 bg-slate-50 dark:bg-neutral-900/80 rounded-xl border border-slate-200/80 dark:border-neutral-800 mb-4">
            <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
              "{ai_suggestion}"
            </p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-800 dark:text-white rounded-xl text-xs font-semibold transition">
            Ask Pilot AI <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;