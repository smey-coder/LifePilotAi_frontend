import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteHabitModal = ({
  isOpen,
  onClose,
  onConfirm,
  habitTitle,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative dark:bg-slate-900 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl dark:text-rose-400">
            <AlertTriangle size={28} />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            លុបទម្លាប់នេះ?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            តើអ្នកពិតជាចង់លុបទម្លាប់{" "}
            <span className="text-slate-800 font-semibold dark:text-slate-200">
              "{habitTitle}"
            </span>{" "}
            នេះមែនទេ? ទិន្នន័យ Streak និង Log ទាំងអស់នឹងត្រូវលុបចោល។
          </p>

          <div className="flex items-center gap-3 w-full pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? "កំពុងលុប..." : "លុបចេញ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteHabitModal;
