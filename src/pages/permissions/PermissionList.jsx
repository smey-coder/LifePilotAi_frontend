import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Key, Edit3, Trash2, RefreshCw, ChevronLeft, ChevronRight, ShieldCheck, Tag, Lock } from 'lucide-react';
import api from '../../services/api';
import useNotification from '../../hooks/useNotification';
import PermissionModal from './PermissionModal';
import DeletePermissionModal from './DeletePermissionModal';

const PermissionList = () => {
  const { showSuccess, showError } = useNotification();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPermissions, setTotalPermissions] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Permissions from API
  const fetchPermissions = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get('/permissions', {
        params: { page, search, per_page: 10 }
      });

      const responseData = response.data?.data;

      if (responseData?.data && Array.isArray(responseData.data)) {
        setPermissions(responseData.data);
        setCurrentPage(responseData.current_page || 1);
        setLastPage(responseData.last_page || 1);
        setTotalPermissions(responseData.total || responseData.data.length);
      } else if (Array.isArray(responseData)) {
        setPermissions(responseData);
        setTotalPermissions(responseData.length);
      } else {
        setPermissions([]);
      }
    } catch (err) {
      showError('មិនអាចទាញយកទិន្នន័យ Permissions បានឡើយ');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPermissions(currentPage, searchQuery);
  }, [fetchPermissions, currentPage]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchPermissions(1, value);
  };

  // Handle Create / Edit Save
  const handleSavePermission = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedPermission) {
        await api.put(`/permissions/${selectedPermission.id}`, formData);
        showSuccess('បានកែប្រែ Permission រួចរាល់', 'កែប្រែជោគជ័យ');
      } else {
        await api.post('/permissions', formData);
        showSuccess('បានបង្កើត Permission ថ្មីដោយជោគជ័យ', 'បង្កើតជោគជ័យ');
      }
      setIsModalOpen(false);
      fetchPermissions(currentPage, searchQuery);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || 'ទិន្នន័យមិនត្រឹមត្រូវឡើយ');
      } else {
        showError(err?.response?.data?.message || 'បរាជ័យក្នុងការរក្សាទុក Permission');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Permission
  const handleDeletePermission = async () => {
    if (!selectedPermission) return;
    setActionLoading(true);
    try {
      await api.delete(`/delete/permissions/${selectedPermission.id}`);
      showSuccess('បានលុប Permission ដោយជោគជ័យ', 'លុបជោគជ័យ');
      setIsDeleteOpen(false);
      fetchPermissions(currentPage, searchQuery);
    } catch (err) {
      showError(err?.response?.data?.message || 'បរាជ័យក្នុងការលុប Permission');
    } finally {
      setActionLoading(false);
    }
  };

  // Badge Color Utility for Modules
  const getModuleBadgeColor = (permName = '') => {
    const module = permName.split('.')[0] || 'general';
    switch (module) {
      case 'users':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'roles':
      case 'permissions':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'tasks':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'notes':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'ai':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
            <Key className="text-indigo-400" size={28} />
            គ្រប់គ្រង Permissions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            សរុប Permissions ទាំងអស់៖ <span className="font-bold text-indigo-400">{totalPermissions}</span>
          </p>
        </div>

        <button
          onClick={() => { setSelectedPermission(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
        >
          <Plus size={16} />
          <span>បង្កើត Permission ថ្មី</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរក Permission (ឧ. users.view)..."
            className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          onClick={() => fetchPermissions(currentPage, searchQuery)}
          className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-400' : ''} />
        </button>
      </div>

      {/* Permissions Data Table */}
      <div className="overflow-hidden bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">ឈ្មោះ Permission</th>
                <th className="py-4 px-6">Module</th>
                <th className="py-4 px-6">Guard Name</th>
                <th className="py-4 px-6 text-right">សកម្មភាព (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 w-8 bg-slate-800 rounded"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-slate-800 rounded"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-800 rounded"></div></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-slate-800 rounded"></div></td>
                    <td className="py-4 px-6 text-right"><div className="h-4 w-16 bg-slate-800 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <Key size={40} className="mx-auto mb-2 text-slate-600" />
                    <span>មិនមានទិន្នន័យ Permission ឡើយ</span>
                  </td>
                </tr>
              ) : (
                permissions.map((perm) => {
                  const badgeStyle = getModuleBadgeColor(perm.name);
                  const moduleName = perm.name.includes('.') ? perm.name.split('.')[0] : 'system';

                  return (
                    <tr
                      key={perm.id}
                      className="hover:bg-slate-800/40 transition duration-150 group"
                    >
                      <td className="py-4 px-6 font-mono text-slate-400 font-semibold">
                        #{perm.id}
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-white tracking-tight">
                        <div className="flex items-center gap-2">
                          <Lock size={13} className="text-indigo-400 shrink-0" />
                          <span>{perm.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg ${badgeStyle}`}>
                          {moduleName}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-400 font-mono">
                        {perm.guard_name || 'sanctum'}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => { setSelectedPermission(perm); setIsModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition"
                            title="កែប្រែ"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => { setSelectedPermission(perm); setIsDeleteOpen(true); }}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                            title="លុប"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/30">
            <p className="text-xs text-slate-400">
              ទំព័រទី <span className="font-bold text-white">{currentPage}</span> នៃ <span className="font-bold text-white">{lastPage}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals Integration */}
      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSavePermission}
        initialData={selectedPermission}
        loading={actionLoading}
      />

      <DeletePermissionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeletePermission}
        permissionName={selectedPermission?.name}
        loading={actionLoading}
      />
    </div>
  );
};

export default PermissionList;