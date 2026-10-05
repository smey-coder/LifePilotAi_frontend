import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteGoalModal({ isOpen, onClose, onConfirm, title, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">លុបគោលដៅ</h3>
              <p className="text-[11px] text-slate-400">សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning Message */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          តើអ្នកប្រាកដថាចង់លុបគោលដៅ <span className="font-bold text-rose-400">"{title}"</span> និង Milestones ទាំងអស់ដែលពាក់ព័ន្ធនេះទេ?
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
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
            <span>{loading ? 'កំពុងលុប...' : 'លុបចេញ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}