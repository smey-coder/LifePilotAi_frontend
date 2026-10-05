import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ShieldCheck, Edit3, Trash2, Key, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import useNotification from '../../hooks/useNotification';
import RoleModal from './RoleModal';
import DeleteRoleModal from './DeleteRoleModal';

const RoleList = () => {
  const { showSuccess, showError } = useNotification();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRoles, setTotalRoles] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Roles from API
  const fetchRoles = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get('/roles', {
        params: { page, search, per_page: 9 }
      });

      const responseData = response.data?.data;

      // ការពារករណី Response ជា Paginated Object ឬ Array ធម្មតា
      if (responseData?.data && Array.isArray(responseData.data)) {
        setRoles(responseData.data);
        setCurrentPage(responseData.current_page || 1);
        setLastPage(responseData.last_page || 1);
        setTotalRoles(responseData.total || responseData.data.length);
      } else if (Array.isArray(responseData)) {
        setRoles(responseData);
        setTotalRoles(responseData.length);
      } else {
        setRoles([]);
      }
    } catch (err) {
      showError('មិនអាចទាញយកទិន្នន័យ Roles បានឡើយ');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Fetch Permissions All List for Modal
  const fetchPermissions = useCallback(async () => {
    try {
      const response = await api.get('/permissions', { params: { all: true } });
      const permsData = response.data?.data ?? response.data ?? [];
      setPermissions(Array.isArray(permsData) ? permsData : permsData.data || []);
    } catch (err) {
      console.warn('Failed to fetch permissions', err);
    }
  }, []);

  useEffect(() => {
    fetchRoles(currentPage, searchQuery);
    fetchPermissions();
  }, [fetchRoles, fetchPermissions, currentPage]);

  // Search Debounce Handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchRoles(1, value);
  };

  // Handle Create / Edit Submit
  const handleSaveRole = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedRole) {
        await api.put(`/roles/${selectedRole.id}`, formData);
        showSuccess('បានកែប្រែ Role រួចរាល់', 'កែប្រែជោគជ័យ');
      } else {
        await api.post('/roles', formData);
        showSuccess('បានបង្កើត Role ថ្មីដោយជោគជ័យ', 'បង្កើតជោគជ័យ');
      }
      setIsModalOpen(false);
      fetchRoles(currentPage, searchQuery);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || 'ទិន្នន័យមិនត្រឹមត្រូវឡើយ');
      } else {
        showError(err?.response?.data?.message || 'បរាជ័យក្នុងការ រក្សាទុក Role');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Submit
  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setActionLoading(true);
    try {
      await api.delete(`/roles/${selectedRole.id}`);
      showSuccess('បានលុប Role ដោយជោគជ័យ', 'លុបជោគជ័យ');
      setIsDeleteOpen(false);
      fetchRoles(currentPage, searchQuery);
    } catch (err) {
      showError(err?.response?.data?.message || 'បរាជ័យក្នុងការលុប Role');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-indigo-400" size={28} />
            គ្រប់គ្រង Roles & Permissions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            សរុប Roles ទាំងអស់៖ <span className="font-bold text-indigo-400">{totalRoles}</span>
          </p>
        </div>

        <button
          onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200"
        >
          <Plus size={16} />
          <span>បង្កើត Role ថ្មី</span>
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
            placeholder="ស្វែងរកឈ្មោះ Role..."
            className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          onClick={() => fetchRoles(currentPage, searchQuery)}
          className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-400' : ''} />
        </button>
      </div>

      {/* Role Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-44 bg-slate-900/40 border border-slate-800 rounded-3xl animate-pulse p-6" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
          <ShieldCheck size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-400">មិនមានទិន្នន័យ Role ឡើយ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group relative bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    ID: #{role.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedRole(role); setIsModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition"
                      title="កែប្រែ"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => { setSelectedRole(role); setIsDeleteOpen(true); }}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                      title="លុប"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-3">{role.name}</h3>

                {/* Permissions Badge List */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.slice(0, 5).map((p) => (
                      <span
                        key={p.id || p.name}
                        className="px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-slate-950/60 border border-slate-800 rounded-md flex items-center gap-1"
                      >
                        <Key size={10} className="text-indigo-400" />
                        {p.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">គ្មាន Permissions ឡើយ</span>
                  )}
                  {role.permissions?.length > 5 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                      +{role.permissions.length - 5} ទៀត
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Guard: <strong className="text-slate-400">{role.guard_name || 'sanctum'}</strong></span>
                <span>សរុប: <strong className="text-indigo-400">{role.permissions?.length || 0}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
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

      {/* Modals */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveRole}
        initialData={selectedRole}
        availablePermissions={permissions}
        loading={actionLoading}
      />

      <DeleteRoleModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteRole}
        roleName={selectedRole?.name}
        loading={actionLoading}
      />
    </div>
  );
};

export default RoleList;