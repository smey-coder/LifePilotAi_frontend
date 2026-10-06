import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Flame,
  Check,
  RefreshCw,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import HabitModal from "./HabitModal";
import DeleteHabitModal from "./DeleteHabitModal";
import HabitLogModal from "./HabitLogModal";

const getAccessNames = (values) => {
  const entries = Array.isArray(values)
    ? values
    : values == null
      ? []
      : [values];
  return entries
    .map((entry) => (typeof entry === "string" ? entry : entry?.name))
    .filter((name) => typeof name === "string" && name.trim())
    .map((name) => name.trim().toLowerCase());
};
const HabitList = () => {
  const { showSuccess, showError } = useNotification();
  const {
    user,
    roles = [],
    permissions = [],
    loading: authLoading,
  } = useAuth();
  const userRoles = [
    ...getAccessNames(roles),
    ...getAccessNames(user?.roles),
    ...getAccessNames(user?.role),
  ].map((role) => role.replace(/[_-]+/g, " "));
  const isAdmin = userRoles.some((role) =>
    ["admin", "super admin", "superadmin"].includes(role),
  );
  const userPermissions = [
    ...getAccessNames(permissions),
    ...getAccessNames(user?.permissions),
  ];

  const hasPermission = (permission) =>
    isAdmin || userPermissions.includes(permission.trim().toLowerCase());

  const canViewHabitLogs = hasPermission("habits.logs");
  const canViewHabits = hasPermission("habits.view");
  const canCreateHabits =
    hasPermission("habits.create") || hasPermission("habits.manage");
  const canUpdateHabits =
    hasPermission("habits.update") ||
    hasPermission("habits.edit") ||
    hasPermission("habits.manage");
  const canDeleteHabits =
    hasPermission("habits.delete") || hasPermission("habits.manage");

  // State Management
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Generate last 7 days array for quick weekly tracking bar
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        formatted: d.toISOString().split("T")[0], // YYYY-MM-DD
        dayName: d.toLocaleDateString("km-KH", { weekday: "short" }),
        dateNum: d.getDate(),
        isToday: i === 0,
      });
    }
    return days;
  };

  const daysList = getLast7Days();

  // Fetch Habits List
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/habits");
      setHabits(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      showError("មិនអាចទាញយកទិន្នន័យ Habit Tracking បានឡើយ");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Create or Edit Habit
  const handleSaveHabit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedHabit && selectedHabit.id) {
        await api.put(`/habits/${selectedHabit.id}`, formData);
        showSuccess("បានកែប្រែ Habit រួចរាល់");
      } else {
        await api.post("/habits", formData);
        showSuccess("បានបង្កើត Habit ថ្មីដោយជោគជ័យ");
      }
      setIsModalOpen(false);
      setSelectedHabit(null);
      fetchHabits();
    } catch (err) {
      showError("បរាជ័យក្នុងការរក្សាទុក Habit");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Toggle Log Status
  const handleToggleDate = async (habitId, completedDateStr) => {
    try {
      const response = await api.post(`/habits/${habitId}/toggle`, {
        completed_date: completedDateStr,
      });
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? response.data : h)),
      );
    } catch (err) {
      showError("មិនអាចទាញយក Status របស់ Habit បានឡើយ");
    }
  };

  // Delete Habit
  const handleDeleteHabit = async () => {
    if (!selectedHabit || !selectedHabit.id) return;
    setActionLoading(true);

    try {
      await api.delete(`/habits/${selectedHabit.id}`);
      showSuccess("បានលុប Habit រួចរាល់");
      setIsDeleteOpen(false);
      setSelectedHabit(null);
      fetchHabits();
    } catch (err) {
      showError("មិនអាចលុប Habit បានឡើយ");
    } finally {
      setActionLoading(false);
    }
  };

  // Sync state when log is toggled inside HabitLogModal
  const handleHabitUpdatedFromModal = (updatedHabit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shadow-inner">
              <Flame size={24} />
            </div>
            <span>Habit Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 dark:text-slate-400">
            តាមដាន និងរក្សាទម្លាប់ល្អៗរបស់អ្នកជារៀងរាល់ថ្ងៃ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHabits}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all active:scale-95 dark:text-slate-400 dark:hover:text-white dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:border-slate-800"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-amber-400" : ""}
            />
          </button>

          {canCreateHabits && (
            <button
              onClick={() => {
                setSelectedHabit(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={16} />
              <span>បង្កើតទម្លាប់ថ្មី</span>
            </button>
          )}
        </div>
      </div>

      {/* Habit Cards */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 bg-slate-200 border border-slate-300 rounded-2xl animate-pulse dark:bg-slate-900/60 dark:border-slate-800"
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-12 text-center text-slate-500 backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-500">
          <div className="w-16 h-16 bg-slate-200 border border-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400">
            <Sparkles size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            មិនទាន់មានទម្លាប់នៅឡើយទេ
          </h3>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-500">
            សូមចុច "+ បង្កើតទម្លាប់ថ្មី" ដើម្បីចាប់ផ្តើមតាមដាន Streak
            ដំបូងរបស់អ្នក
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const loggedDates = (habit.logs || []).map((l) =>
              typeof l.completed_date === "string"
                ? l.completed_date.split("T")[0]
                : l.completed_date,
            );

            return (
              <div
                key={habit.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-all duration-200 dark:bg-slate-900/60 dark:border-slate-800/80 dark:hover:border-slate-700/80"
              >
                {/* Habit Title & Streak Count */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {habit.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
                      <Flame size={12} /> {habit.streak_count ?? 0} Streak
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 capitalize dark:text-slate-400">
                    ចន្លោះពេល: {habit.frequency || "daily"}
                  </p>
                </div>

                {/* Last 7 Days Quick Tracker */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-200 pt-3 md:pt-0 dark:border-slate-800">
                  {daysList.map((d) => {
                    const isCompleted = loggedDates.includes(d.formatted);
                    return (
                      <button
                        key={d.formatted}
                        onClick={() => handleToggleDate(habit.id, d.formatted)}
                        className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl text-xs transition-all duration-200 active:scale-90 ${
                          isCompleted
                            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-600 font-bold dark:text-emerald-400"
                            : "bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:border-slate-700"
                        } ${d.isToday ? "ring-2 ring-emerald-500/30" : ""}`}
                      >
                        <span className="text-[9px] uppercase tracking-wider">
                          {d.dayName}
                        </span>
                        <span className="text-xs font-mono">{d.dateNum}</span>
                        {isCompleted && <Check size={12} className="mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-1.5 self-end md:self-center">
                  {/* Calendar Modal Trigger Button */}
                  {canViewHabitLogs && (
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsLogModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-all"
                      title="មើលកំណត់ត្រាប្រវត្តិខែ (History Log Modal)"
                    >
                      <Calendar size={14} />
                    </button>
                  )}

                  {canUpdateHabits && (
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-all"
                      title="កែប្រែ"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}

                  {canDeleteHabits && (
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setIsDeleteOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-all"
                      title="លុប"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHabit(null);
        }}
        onSubmit={handleSaveHabit}
        initialData={selectedHabit}
        loading={actionLoading}
      />

      <DeleteHabitModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedHabit(null);
        }}
        onConfirm={handleDeleteHabit}
        habitTitle={selectedHabit?.title || ""}
        loading={actionLoading}
      />

      <HabitLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedHabit(null);
        }}
        habit={selectedHabit}
        onLogUpdated={handleHabitUpdatedFromModal}
      />
    </div>
  );
};

export default HabitList;
