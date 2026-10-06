import React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Trash2,
} from "lucide-react";

export default function GoalCard({
  goal,
  onToggleMilestone,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) {
  const completedMilestones = goal.milestones
    ? goal.milestones.filter((m) => m.is_completed).length
    : 0;
  const totalMilestones = goal.milestones ? goal.milestones.length : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          icon: CheckCircle2,
          style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "behind":
        return {
          label: "Behind",
          icon: AlertCircle,
          style: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        };
      default:
        return {
          label: "On Track",
          icon: Clock,
          style: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        };
    }
  };

  const statusInfo = getStatusBadge(goal.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 hover:border-slate-300 transition group dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700">
      {/* Header & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-500 transition dark:text-white dark:group-hover:text-emerald-400">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
              {goal.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 font-mono dark:text-slate-400">
            <Calendar size={13} className="text-emerald-400" />
            <span>
              Deadline:{" "}
              {goal.target_date
                ? new Date(goal.target_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg flex items-center gap-1.5 shrink-0 ${statusInfo.style}`}
        >
          <StatusIcon size={12} />
          {statusInfo.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-emerald-500 font-mono dark:text-emerald-400">
            {goal.progress_percentage || 0}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${goal.progress_percentage || 0}%` }}
          />
        </div>
      </div>

      {/* Milestones Breakdown */}
      <div className="pt-3 border-t border-slate-200/80 space-y-2 dark:border-slate-800/80">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px] dark:text-slate-400">
            Milestones Breakdown
          </span>
          <span className="text-slate-600 font-mono text-[11px] dark:text-slate-400">
            {completedMilestones}/{totalMilestones}
          </span>
        </div>

        {totalMilestones === 0 ? (
          <p className="text-xs text-slate-600 italic dark:text-slate-400">
            គ្មាន Milestone
          </p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            {goal.milestones.map((ms) => (
              <div
                key={ms.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition dark:bg-slate-950/40 dark:border-slate-800/50 dark:hover:border-slate-700"
              >
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs flex-1">
                  <input
                    type="checkbox"
                    checked={ms.is_completed}
                    disabled={!canEdit}
                    onChange={() => onToggleMilestone(ms.id)}
                    className="w-3.5 h-3.5 rounded bg-white border-slate-300 text-emerald-500 focus:ring-emerald-500/20 disabled:cursor-not-allowed cursor-pointer dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span
                    className={
                      ms.is_completed
                        ? "line-through text-slate-500 dark:text-slate-400"
                        : "text-slate-700 dark:text-slate-200"
                    }
                  >
                    {ms.title}
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {(canEdit || canDelete) && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          {canEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="p-2 text-slate-600 hover:text-emerald-500 hover:bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800"
              title="កែប្រែ"
            >
              <Edit3 size={15} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(goal)}
              className="p-2 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800"
              title="លុប"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
