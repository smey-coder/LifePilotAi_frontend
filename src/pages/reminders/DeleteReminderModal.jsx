import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteReminderModal = ({ isOpen, onClose, onConfirm, title, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-scale-up">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl shadow-lg shadow-rose-500/10">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            បញ្ជាក់ការលុបការរំលឹក
          </h3>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            តើអ្នកពិតជាចង់លុបការរំលឹក <span className="font-bold text-rose-400">"{title || 'នេះ'}"</span> មែនទេ?
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition disabled:opacity-50"
            >
              បោះបង់
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-1/2 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:opacity-50 rounded-xl shadow-lg shadow-rose-600/30 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span>{loading ? 'កំពុងលុប...' : 'លុបចេញ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteReminderModal;