import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Target,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import GoalCard from "./GoalCard";
import GoalModal from "./GoalModal";
import DeleteGoalModal from "./DeleteGoalModal";

const getAccessNames = (values) => {
  const entries = Array.isArray(values)
    ? values
    : values == null
      ? []
      : [values];
  return entries
    .map((entry) => (typeof entry === "string" ? entry : entry?.name))
    .filter((name) => typeof name === "string" && name.trim())
    .map((name) => name.trim().toLowerCase());
};
const GoalList = () => {
  const { showSuccess, showError } = useNotification();
  const {
    user,
    roles = [],
    permissions = [],
    loading: authLoading,
  } = useAuth();
  const userRoles = [
    ...getAccessNames(roles),
    ...getAccessNames(user?.roles),
    ...getAccessNames(user?.role),
  ].map((role) => role.replace(/[_-]+/g, " "));
  const isAdmin = userRoles.some((role) =>
    ["admin", "super admin", "superadmin"].includes(role),
  );
  const userPermissions = [
    ...getAccessNames(permissions),
    ...getAccessNames(user?.permissions),
  ];

  const hasPermission = (permission) =>
    isAdmin || userPermissions.includes(permission.trim().toLowerCase());

  const canViewGoals = hasPermission("goals.view");
  const canCreateGoals =
    hasPermission("goals.create") || hasPermission("goals.manage");
  const canUpdateGoals =
    hasPermission("goals.update") ||
    hasPermission("goals.edit") ||
    hasPermission("goals.manage");
  const canDeleteGoals =
    hasPermission("goals.delete") || hasPermission("goals.manage");

  // Core States
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalGoals, setTotalGoals] = useState(0);

  // Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Goals API
  const fetchGoals = useCallback(
    async (page = 1, search = "", status = "") => {
      setLoading(true);
      try {
        const response = await api.get("/goals", {
          params: { page, search, status, per_page: 10 },
        });

        const responseData = response.data?.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setGoals(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalGoals(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setGoals(responseData);
          setTotalGoals(responseData.length);
        } else if (Array.isArray(response.data)) {
          setGoals(response.data);
          setTotalGoals(response.data.length);
        } else {
          setGoals([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកទិន្នន័យ Goal Tracking បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    if (authLoading || !canViewGoals) return;
    fetchGoals(currentPage, searchQuery, statusFilter);
  }, [
    authLoading,
    canViewGoals,
    fetchGoals,
    currentPage,
    searchQuery,
    statusFilter,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Create or Update Goal
  const handleSaveGoal = async (formData) => {
    if (selectedGoal ? !canUpdateGoals : !canCreateGoals) return;
    setActionLoading(true);
    try {
      if (selectedGoal) {
        await api.put(`/goals/${selectedGoal.id}`, formData);
        showSuccess("បានកែប្រែ Goal រួចរាល់", "កែប្រែជោគជ័យ");
      } else {
        await api.post("/goals", formData);
        showSuccess("បានបង្កើត Goal ថ្មីដោយជោគជ័យ", "បង្កើតជោគជ័យ");
      }
      setIsModalOpen(false);
      setSelectedGoal(null);
      await fetchGoals(currentPage, searchQuery, statusFilter);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || "ទិន្នន័យមិនត្រឹមត្រូវឡើយ");
      } else {
        showError(
          err?.response?.data?.message || "បរាជ័យក្នុងការរក្សាទុក Goal",
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Milestone Status
  const handleToggleMilestone = async (milestoneId) => {
    if (!canUpdateGoals) return;
    try {
      await api.patch(`/milestones/${milestoneId}/toggle`);
      await fetchGoals(currentPage, searchQuery, statusFilter);
    } catch (err) {
      showError("មិនអាចប្តូរ Status របស់ Milestone បានឡើយ");
    }
  };

  // Delete Goal
  const handleDeleteGoal = async () => {
    if (!selectedGoal || !canDeleteGoals) return;
    setActionLoading(true);
    try {
      await api.delete(`/goals/${selectedGoal.id}`);
      showSuccess("បានលុប Goal ដោយជោគជ័យ", "លុបជោគជ័យ");
      setIsDeleteOpen(false);
      setSelectedGoal(null);
      await fetchGoals(currentPage, searchQuery, statusFilter);
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការលុប Goal");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) return null;

  if (!canViewGoals) {
    return (
      <div className="p-6 text-center text-slate-400">
        You do not have permission to view goals.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shadow-inner">
              <Target size={24} />
            </div>
            <span>Goal Tracking System</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
            <span>សរុបគោលដៅទាំងអស់៖</span>
            <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              {totalGoals}
            </span>
          </p>
        </div>

        {canCreateGoals && (
          <button
            onClick={() => {
              setSelectedGoal(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
          >
            <Plus size={16} />
            <span>បង្កើតគោលដៅថ្មី</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរកគោលដៅ..."
            className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200"
          />
        </div>

        {/* Filters and Refresh */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500/60 transition-all duration-200 cursor-pointer"
          >
            <option value="">Status ទាំងអស់</option>
            <option value="on_track">On Track</option>
            <option value="behind">Behind</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => fetchGoals(currentPage, searchQuery, statusFilter)}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 hover:border-slate-600 transition-all duration-200 shrink-0 active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-emerald-400" : ""}
            />
          </button>
        </div>
      </div>

      {/* Goals Display Area */}
      <div className="space-y-6">
        {loading ? (
          /* Loading Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-slate-800 rounded-md"></div>
                    <div className="h-3 w-3/4 bg-slate-800/60 rounded-md"></div>
                  </div>
                  <div className="h-6 w-20 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-800/40 rounded-full"></div>
                  <div className="h-2 w-full bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-20 bg-slate-950/40 rounded-2xl border border-slate-800/50"></div>
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center text-slate-500 backdrop-blur-md shadow-xl">
            <div className="w-16 h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Sparkles size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-300">
              មិនមានទិន្នន័យគោលដៅឡើយ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              សូមចុច "+ បង្កើតគោលដៅថ្មី" ដើម្បីចាប់ផ្តើមតាមដាន Goal
              ដំបូងរបស់អ្នក
            </p>
          </div>
        ) : (
          /* Goal Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleMilestone={handleToggleMilestone}
                onEdit={(g) => {
                  setSelectedGoal(g);
                  setIsModalOpen(true);
                }}
                onDelete={(g) => {
                  setSelectedGoal(g);
                  setIsDeleteOpen(true);
                }}
                canEdit={canUpdateGoals}
                canDelete={canDeleteGoals}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md shadow-lg">
            <p className="text-xs text-slate-400">
              ទំព័រទី{" "}
              <span className="font-bold font-mono text-white">
                {currentPage}
              </span>{" "}
              នៃ{" "}
              <span className="font-bold font-mono text-white">{lastPage}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 rounded-xl transition-all duration-200 active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-950/80 border border-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 rounded-xl transition-all duration-200 active:scale-95"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveGoal}
        initialData={selectedGoal}
        loading={actionLoading}
      />

      <DeleteGoalModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteGoal}
        title={selectedGoal?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default GoalList;
