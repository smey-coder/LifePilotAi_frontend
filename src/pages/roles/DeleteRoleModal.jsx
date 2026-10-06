import React from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

const DeleteRoleModal = ({ isOpen, onClose, onConfirm, roleName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl animate-scale-up dark:bg-slate-900 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition duration-200 disabled:opacity-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div className="p-6 text-center">
          {/* Warning Icon with Glow */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl shadow-lg shadow-rose-500/10">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2 dark:text-white">
            បញ្ជាក់ការលុប Role
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed mb-6 dark:text-slate-400">
            តើអ្នកពិតជាចង់លុប Role{" "}
            <span className="font-bold text-rose-500">
              "{roleName || "នេះ"}"
            </span>{" "}
            ចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះនឹងផ្តាច់ Permissions ទាំងអស់
            ហើយមិនអាចត្រឡប់ក្រោយវិញបានឡើយ។
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition duration-200 disabled:opacity-50 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700/80"
            >
              បោះបង់
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-1/2 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-50 rounded-xl shadow-lg shadow-rose-600/30 transition duration-200"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span>{loading ? "កំពុងលុប..." : "លុបចេញ"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
