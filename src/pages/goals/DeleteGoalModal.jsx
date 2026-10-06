import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteGoalModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150 dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl dark:text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                លុបគោលដៅ
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning Message */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:text-slate-300 dark:bg-slate-950/60 dark:border-slate-800">
          តើអ្នកប្រាកដថាចង់លុបគោលដៅ{" "}
          <span className="font-bold text-rose-500 dark:text-rose-400">
            "{title}"
          </span>{" "}
          និង Milestones ទាំងអស់ដែលពាក់ព័ន្ធនេះទេ?
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>{loading ? "កំពុងលុប..." : "លុបចេញ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
