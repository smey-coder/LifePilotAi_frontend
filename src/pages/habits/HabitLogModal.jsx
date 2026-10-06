import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Flame,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";

const HabitLogModal = ({ isOpen, onClose, habit, onLogUpdated }) => {
  const { user, roles = [], permissions = [] } = useAuth();
  const { showSuccess, showError } = useNotification();

  // RBAC Permission Check
  const userRoles = (user?.roles || roles).map((r) =>
    typeof r === "string" ? r.toLowerCase() : r.name.toLowerCase(),
  );
  const isAdmin =
    userRoles.includes("admin") || userRoles.includes("super admin");

  const hasPermission = (permission) => {
    if (isAdmin) return true;
    const userPerms = (user?.permissions || permissions).map((p) =>
      typeof p === "string" ? p.toLowerCase() : p.name.toLowerCase(),
    );
    return userPerms.includes(permission.toLowerCase());
  };

  const canLog =
    hasPermission("habits.manage") || hasPermission("habits.log") || true;

  // State Management
  const [currentHabit, setCurrentHabit] = useState(habit);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setCurrentHabit(habit);
  }, [habit]);

  if (!isOpen || !currentHabit) return null;

  // Month Navigation Controls
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Calendar Calculation Helpers
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
  ];

  // Logged dates list
  const loggedDates = (currentHabit.logs || []).map((l) =>
    typeof l.completed_date === "string"
      ? l.completed_date.split("T")[0]
      : l.completed_date,
  );

  // Stats calculation for current month
  const monthLogsCount = loggedDates.filter((d) => {
    const dateObj = new Date(d);
    return dateObj.getFullYear() === year && dateObj.getMonth() === month;
  }).length;

  const completionPercentage = Math.round((monthLogsCount / daysInMonth) * 100);

  // Toggle Completion Handler
  const handleToggleLog = async (dateStr) => {
    if (!canLog || loading) return;
    setLoading(true);

    try {
      const response = await api.post(`/habits/${currentHabit.id}/toggle`, {
        completed_date: dateStr,
      });

      setCurrentHabit(response.data);
      if (onLogUpdated) onLogUpdated(response.data);
      showSuccess("បានធ្វើបច្ចុប្បន្នភាពកំណត់ត្រាទម្លាប់");
    } catch (err) {
      showError("បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពកំណត់ត្រា");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-6 relative overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl dark:text-indigo-400">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {currentHabit.title}
              </h2>
              <p className="text-xs text-slate-500 capitalize dark:text-slate-400">
                កំណត់ត្រាប្រវត្តិសកម្មភាព • {currentHabit.frequency || "daily"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Month Selector & Stats Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-2xl dark:bg-slate-950/60 dark:border-slate-800/80">
          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[90px] text-center dark:text-white">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-xs font-bold dark:text-indigo-400">
              <TrendingUp size={13} />
              <span>{completionPercentage}% ខែនេះ</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-bold dark:text-amber-400">
              <Flame size={13} />
              <span>{currentHabit.streak_count ?? 0} Streak</span>
            </div>
          </div>
        </div>

        {/* Interactive Calendar Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["អាទិត្យ", "ច័ន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍"].map(
              (d) => (
                <div
                  key={d}
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-1 dark:text-slate-400"
                >
                  {d}
                </div>
              ),
            )}

            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-10 rounded-xl bg-transparent"
              />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isCompleted = loggedDates.includes(dateStr);
              const isToday =
                new Date().toDateString() ===
                new Date(year, month, dayNum).toDateString();

              return (
                <button
                  key={dateStr}
                  disabled={loading}
                  onClick={() => handleToggleLog(dateStr)}
                  className={`h-10 rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 relative group ${
                    isCompleted
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 font-bold dark:text-emerald-300"
                      : "bg-slate-100 border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-950/60 dark:border-slate-800/80 dark:text-slate-400 dark:hover:border-slate-700"
                  } ${isToday ? "ring-2 ring-indigo-500/60" : ""}`}
                >
                  <span className="text-[10px] font-mono">{dayNum}</span>
                  {isCompleted ? (
                    <CheckCircle2
                      size={11}
                      className="text-emerald-500 mt-0.5 dark:text-emerald-400"
                    />
                  ) : (
                    <XCircle
                      size={11}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 dark:text-slate-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitLogModal;
