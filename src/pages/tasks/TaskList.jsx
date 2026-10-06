import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  CheckSquare,
  Edit3,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";
import TaskModal from "./TaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

const TaskList = () => {
  const { showSuccess, showError } = useNotification();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Tasks from API
  const fetchTasks = useCallback(
    async (page = 1, search = "", status = "", priority = "") => {
      setLoading(true);
      try {
        const response = await api.get("/tasks", {
          params: { page, search, status, priority, per_page: 10 },
        });

        const responseData = response.data?.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setTasks(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalTasks(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setTasks(responseData);
          setTotalTasks(responseData.length);
        } else {
          setTasks([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកទិន្នន័យ Tasks បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    fetchTasks(currentPage, searchQuery, statusFilter, priorityFilter);
  }, [fetchTasks, currentPage, statusFilter, priorityFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchTasks(1, value, statusFilter, priorityFilter);
  };

  const handleSaveTask = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}`, formData);
        showSuccess("បានកែប្រែ Task រួចរាល់", "កែប្រែជោគជ័យ");
      } else {
        await api.post("/tasks", formData);
        showSuccess("បានបង្កើត Task ថ្មីដោយជោគជ័យ", "បង្កើតជោគជ័យ");
      }
      setIsModalOpen(false);
      fetchTasks(currentPage, searchQuery, statusFilter, priorityFilter);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || "ទិន្នន័យមិនត្រឹមត្រូវឡើយ");
      } else {
        showError(
          err?.response?.data?.message || "បរាជ័យក្នុងការរក្សាទុក Task",
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Status Toggle Endpoint (PATCH /tasks/{id}/status)
  const handleQuickStatusChange = async (taskId, currentStatus) => {
    const nextStatusMap = {
      todo: "in_progress",
      in_progress: "done",
      done: "todo",
    };
    const nextStatus = nextStatusMap[currentStatus] || "todo";

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: nextStatus });
      fetchTasks(currentPage, searchQuery, statusFilter, priorityFilter);
    } catch (err) {
      showError("មិនអាចផ្លាស់ប្តូរ Status បានឡើយ");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    setActionLoading(true);
    try {
      await api.delete(`/tasks/${selectedTask.id}`);
      showSuccess("បានលុប Task ដោយជោគជ័យ", "លុបជោគជ័យ");
      setIsDeleteOpen(false);
      fetchTasks(currentPage, searchQuery, statusFilter, priorityFilter);
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការលុប Task");
    } finally {
      setActionLoading(false);
    }
  };

  // Badge Color Styles for Priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Status Badge Styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "done":
        return {
          label: "Done",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "in_progress":
        return {
          label: "In Progress",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: Clock,
        };
      default:
        return {
          label: "To Do",
          color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: Circle,
        };
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <CheckSquare className="text-indigo-400" size={28} />
            គ្រប់គ្រង Tasks
          </h1>
          <p className="text-xs text-slate-600 mt-1 dark:text-slate-400">
            សរុប Tasks ទាំងអស់៖{" "}
            <span className="font-bold text-indigo-400">{totalTasks}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
        >
          <Plus size={16} />
          <span>បង្កើត Task ថ្មី</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-100 border border-slate-200 rounded-2xl backdrop-blur-md dark:bg-slate-900/60 dark:border-slate-800">
        <div className="relative flex-1 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរក Task..."
            className="w-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-slate-300 dark:bg-slate-950/60 dark:border-slate-800"
          >
            <option value="">Status ទាំងអស់</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-slate-300 dark:bg-slate-950/60 dark:border-slate-800"
          >
            <option value="">Priority ទាំងអស់</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <button
            onClick={() =>
              fetchTasks(currentPage, searchQuery, statusFilter, priorityFilter)
            }
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl border border-slate-200 transition shrink-0 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-800"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-indigo-400" : ""}
            />
          </button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-xl backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <th className="py-4 px-6">ចំណងជើង Task</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-xs dark:divide-slate-800/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-slate-500 dark:text-slate-500"
                  >
                    <CheckSquare
                      size={40}
                      className="mx-auto mb-2 text-slate-600"
                    />
                    <span>មិនមានទិន្នន័យ Task ឡើយ</span>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const statusInfo = getStatusBadge(task.status);
                  const StatusIcon = statusInfo.icon;
                  const priorityStyle = getPriorityBadge(task.priority);

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-100 transition duration-150 group dark:hover:bg-slate-800/40"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() =>
                              handleQuickStatusChange(task.id, task.status)
                            }
                            className="mt-0.5 text-slate-500 hover:text-indigo-400 transition"
                            title="ចុចដើម្បីផ្លាស់ប្តូរ Status"
                          >
                            <StatusIcon
                              size={16}
                              className={
                                task.status === "done" ? "text-emerald-400" : ""
                              }
                            />
                          </button>
                          <div>
                            <div
                              className={`font-bold text-slate-900 ${task.status === "done" ? "line-through text-slate-500" : ""} dark:text-white`}
                            >
                              {task.title}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 dark:text-slate-400">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            handleQuickStatusChange(task.id, task.status)
                          }
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg flex items-center gap-1.5 ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </button>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg ${priorityStyle}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-600 font-mono text-[11px] dark:text-slate-400">
                        {task.due_date ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-500" />
                            <span>
                              {new Date(task.due_date).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">
                            គ្មានថ្ងៃកំណត់
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-600 hover:text-indigo-500 hover:bg-slate-100 rounded-xl transition dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
                            title="កែប្រែ"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTask(task);
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
                  );
                })
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

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={selectedTask}
        loading={actionLoading}
      />

      <DeleteTaskModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTask}
        taskTitle={selectedTask?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default TaskList;
