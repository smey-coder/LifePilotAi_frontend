import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Sparkles } from 'lucide-react';

const RoleModal = ({ isOpen, onClose, onSubmit, initialData, availablePermissions = [], loading }) => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name || '');
      // បំលែង Permissions Array
      const perms = initialData.permissions?.map(p => typeof p === 'string' ? p : p.name) || [];
      setSelectedPermissions(perms);
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTogglePermission = (permName) => {
    setSelectedPermissions(prev =>
      prev.includes(permName)
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  };

  const handleSelectAll = () => {
    const allNames = availablePermissions.map(p => typeof p === 'string' ? p : p.name);
    if (selectedPermissions.length === allNames.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allNames);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    // ផ្ញើ Object ដែលមាន guard_name sanctum
    onSubmit({
      name: roleName.trim(),
      guard_name: 'sanctum',
      permissions: selectedPermissions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'កែប្រែ Role' : 'បង្កើត Role ថ្មី'}
              </h3>
              <p className="text-xs text-slate-400">កំណត់ឈ្មោះ Role និងជ្រើសរើស Permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-300">
              ឈ្មោះ Role <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="ឧទាហរណ៍: Editor, Moderator..."
              required
              className="w-full px-4 py-3 text-sm text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                ជ្រើសរើស Permissions ({selectedPermissions.length}/{availablePermissions.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                {selectedPermissions.length === availablePermissions.length ? 'ដកចេញទាំងអស់' : 'ជ្រើសរើសទាំងអស់'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl custom-scrollbar">
              {availablePermissions.map((perm) => {
                const permName = typeof perm === 'string' ? perm : perm.name;
                const isSelected = selectedPermissions.includes(permName);
                return (
                  <button
                    key={permName}
                    type="button"
                    onClick={() => handleTogglePermission(permName)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate mr-2">{permName}</span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                      isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-950/50'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading || !roleName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{initialData ? 'រក្សាទុកការកែប្រែ' : 'បង្កើត Role'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;