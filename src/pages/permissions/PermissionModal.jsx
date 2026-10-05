import React, { useState, useEffect } from 'react';
import { X, Key, Shield } from 'lucide-react';

const PermissionModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [permissionName, setPermissionName] = useState('');
  const [guardName, setGuardName] = useState('sanctum');

  useEffect(() => {
    if (initialData) {
      setPermissionName(initialData.name || '');
      setGuardName(initialData.guard_name || 'sanctum');
    } else {
      setPermissionName('');
      setGuardName('sanctum');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!permissionName.trim()) return;
    onSubmit({
      name: permissionName.trim(),
      guard_name: guardName.trim() || 'sanctum',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Key size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'កែប្រែ Permission' : 'បង្កើត Permission ថ្មី'}
              </h3>
              <p className="text-xs text-slate-400">កំណត់ឈ្មោះសិទ្ធិប្រើប្រាស់ក្នុងប្រព័ន្ធ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-300">
              ឈ្មោះ Permission <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={permissionName}
              onChange={(e) => setPermissionName(e.target.value)}
              placeholder="ឧទាហរណ៍: users.view, tasks.create..."
              required
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              ទម្រង់ដែលណែនាំ៖ <code className="text-indigo-400">module.action</code> (ឧ. <code className="text-indigo-300">notes.delete</code>)
            </p>
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-300">
              Guard Name
            </label>
            <div className="relative">
              <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={guardName}
                onChange={(e) => setGuardName(e.target.value)}
                placeholder="sanctum"
                className="w-full pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading || !permissionName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{initialData ? 'រក្សាទុកការកែប្រែ' : 'បង្កើត Permission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;