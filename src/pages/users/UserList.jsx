import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Users,
  Edit3,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";
import UserModal from "./UserModal";
import DeleteUserModal from "./DeleteUserModal";

const UserList = () => {
  const { showSuccess, showError } = useNotification();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(
    async (page = 1, search = "") => {
      setLoading(true);
      try {
        const response = await api.get("/users", {
          params: { page, search, per_page: 10 },
        });

        const responseData = response.data?.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setUsers(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalUsers(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setUsers(responseData);
          setTotalUsers(responseData.length);
        } else {
          setUsers([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកទិន្នន័យ Users បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  // Fetch Roles All List
  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/roles", { params: { all: true } });
      const rolesData = response.data?.data ?? response.data ?? [];
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData.data || []);
    } catch (err) {
      console.warn("Failed to fetch roles", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
    fetchRoles();
  }, [fetchUsers, fetchRoles, currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  };

  const handleSaveUser = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formData);
        showSuccess("បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់រួចរាល់", "កែប្រែជោគជ័យ");
      } else {
        await api.post("/users", formData);
        showSuccess("បានបង្កើតអ្នកប្រើប្រាស់ថ្មីដោយជោគជ័យ", "បង្កើតជោគជ័យ");
      }
      setIsModalOpen(false);
      fetchUsers(currentPage, searchQuery);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || "ទិន្នន័យមិនត្រឹមត្រូវឡើយ");
      } else {
        showError(err?.response?.data?.message || "បរាជ័យក្នុងការរក្សាទុក");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      showSuccess("បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ", "លុបជោគជ័យ");
      setIsDeleteOpen(false);
      fetchUsers(currentPage, searchQuery);
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការលុប");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <Users className="text-indigo-400" size={28} />
            គ្រប់គ្រង Users
          </h1>
          <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
            សរុប អ្នកប្រើប្រាស់ទាំងអស់៖{" "}
            <span className="font-bold text-indigo-400">{totalUsers}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus size={16} />
          <span>បង្កើត User ថ្មី</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-100 border border-slate-200 rounded-2xl backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរកតាមឈ្មោះ ឬអុីមែល..."
            className="w-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
          />
        </div>

        <button
          onClick={() => fetchUsers(currentPage, searchQuery)}
          className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl border border-slate-200 transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-800"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin text-indigo-400" : ""}
          />
        </button>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">ឈ្មោះ</th>
                <th className="py-4 px-6">អុីមែល</th>
                <th className="py-4 px-6">Roles</th>
                <th className="py-4 px-6 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-xs dark:divide-slate-800/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 dark:text-slate-500"
                  >
                    <Users
                      size={40}
                      className="mx-auto mb-2 text-slate-600 dark:text-slate-600"
                    />
                    <span>មិនមានទិន្នន័យ User ឡើយ</span>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-100 transition group dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 px-6 font-mono text-slate-500 font-semibold dark:text-slate-400">
                      #{u.id}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail
                          size={13}
                          className="text-slate-500 dark:text-slate-500"
                        />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {u.roles && u.roles.length > 0 ? (
                          u.roles.map((r) => (
                            <span
                              key={r.id || r.name}
                              className="px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md flex items-center gap-1 dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-500/20"
                            >
                              <ShieldCheck
                                size={11}
                                className="text-indigo-500 dark:text-indigo-400"
                              />
                              {r.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic dark:text-slate-500">
                            គ្មាន Role ឡើយ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-600 hover:text-indigo-500 hover:bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
                          title="កែប្រែ"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-slate-800"
                          title="លុប"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              ទំព័រទី{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {currentPage}
              </span>{" "}
              នៃ{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {lastPage}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 disabled:opacity-40 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 disabled:opacity-40 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals Integration */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        initialData={selectedUser}
        availableRoles={roles}
        loading={actionLoading}
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.name}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserList;
