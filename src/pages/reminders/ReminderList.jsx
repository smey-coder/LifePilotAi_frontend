import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Bell,
  Edit3,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import ReminderModal from "./ReminderModal";
import DeleteReminderModal from "./DeleteReminderModal";

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

const ReminderList = () => {
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

  const canViewReminders = hasPermission("reminders.view");
  const canCreateReminders = hasPermission("reminders.create");
  const canUpdateReminders = hasPermission("reminders.update");
  const canDeleteReminders = hasPermission("reminders.delete");

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalReminders, setTotalReminders] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReminders = useCallback(
    async (page = 1, search = "", channel = "") => {
      setLoading(true);
      try {
        const response = await api.get("/reminders", {
          params: { page, search, channel, per_page: 10 },
        });

        const responseData = response.data?.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setReminders(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalReminders(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setReminders(responseData);
          setTotalReminders(responseData.length);
        } else {
          setReminders([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកទិន្នន័យ Reminders បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    if (!authLoading && canViewReminders) {
      fetchReminders(currentPage, searchQuery, channelFilter);
    }
  }, [
    authLoading,
    canViewReminders,
    fetchReminders,
    currentPage,
    searchQuery,
    channelFilter,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSaveReminder = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedReminder) {
        await api.put(`/reminders/${selectedReminder.id}`, formData);
        showSuccess("បានកែប្រែ Reminder រួចរាល់", "កែប្រែជោគជ័យ");
      } else {
        await api.post("/reminders", formData);
        showSuccess("បានបង្កើត Reminder ថ្មីដោយជោគជ័យ", "បង្កើតជោគជ័យ");
      }
      setIsModalOpen(false);
      fetchReminders(currentPage, searchQuery, channelFilter);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]?.[0];
        showError(firstErr || "ទិន្នន័យមិនត្រឹមត្រូវឡើយ");
      } else {
        showError(
          err?.response?.data?.message || "បរាជ័យក្នុងការរក្សាទុក Reminder",
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTriggered = async (reminderId) => {
    try {
      await api.patch(`/reminders/${reminderId}/toggle`);
      fetchReminders(currentPage, searchQuery, channelFilter);
    } catch (err) {
      showError("មិនអាចប្តូរ Status បានឡើយ");
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedReminder) return;
    setActionLoading(true);
    try {
      await api.delete(`/reminders/${selectedReminder.id}`);
      showSuccess("បានលុប Reminder ដោយជោគជ័យ", "លុបជោគជ័យ");
      setIsDeleteOpen(false);
      fetchReminders(currentPage, searchQuery, channelFilter);
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការលុប Reminder");
    } finally {
      setActionLoading(false);
    }
  };

  const getChannelBadge = (channel) => {
    switch (channel) {
      case "telegram":
        return {
          label: "Telegram",
          icon: MessageSquare,
          style: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        };
      case "email":
        return {
          label: "Email",
          icon: Mail,
          style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        };
      default:
        return {
          label: "Browser",
          icon: Bell,
          style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
    }
  };

  if (authLoading) return null;

  if (!canViewReminders) {
    return (
      <div className="p-6 text-center text-slate-400">
        You do not have permission to view reminders.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
            <Bell className="text-emerald-400" size={28} />
            Intelligent Reminders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            សរុបការរំលឹកទាំងអស់៖{" "}
            <span className="font-bold text-emerald-400">{totalReminders}</span>
          </p>
        </div>

        {canCreateReminders && (
          <button
            onClick={() => {
              setSelectedReminder(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition duration-200"
          >
            <Plus size={16} />
            <span>បង្កើតការរំលឹកថ្មី</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1 w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="ស្វែងរកការរំលឹក..."
            className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={channelFilter}
            onChange={(e) => {
              setChannelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="">Channel ទាំងអស់</option>
            <option value="browser">Browser</option>
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
          </select>

          <button
            onClick={() =>
              fetchReminders(currentPage, searchQuery, channelFilter)
            }
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition shrink-0"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-emerald-400" : ""}
            />
          </button>
        </div>
      </div>

      {/* Reminders Table */}
      <div className="overflow-hidden bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ចំណងជើងការរំលឹក</th>
                <th className="py-4 px-6">ម៉ោងរំលឹក (Remind At)</th>
                <th className="py-4 px-6">Frequency</th>
                <th className="py-4 px-6">Channel</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 w-48 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-28 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-16 bg-slate-800 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : reminders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Bell size={40} className="mx-auto mb-2 text-slate-600" />
                    <span>មិនមានទិន្នន័យការរំលឹកឡើយ</span>
                  </td>
                </tr>
              ) : (
                reminders.map((reminder) => {
                  const channelInfo = getChannelBadge(reminder.channel);
                  const ChannelIcon = channelInfo.icon;
                  const statusLabel = reminder.is_triggered
                    ? "Triggered"
                    : "Active";
                  const statusClass = `px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg transition ${
                    reminder.is_triggered
                      ? "bg-slate-800/80 text-slate-500 border-slate-700"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`;

                  return (
                    <tr
                      key={reminder.id}
                      className="hover:bg-slate-800/40 transition duration-150 group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">
                          {reminder.title}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-emerald-400" />
                          <span>
                            {new Date(reminder.remind_at).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                          {reminder.frequency}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg flex items-center gap-1.5 w-max ${channelInfo.style}`}
                        >
                          <ChannelIcon size={12} />
                          {channelInfo.label}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {canUpdateReminders ? (
                          <button
                            onClick={() => handleToggleTriggered(reminder.id)}
                            className={statusClass}
                          >
                            {statusLabel}
                          </button>
                        ) : (
                          <span className={statusClass}>{statusLabel}</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition">
                          {canUpdateReminders && (
                            <button
                              onClick={() => {
                                setSelectedReminder(reminder);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition"
                              title="កែប្រែ"
                            >
                              <Edit3 size={15} />
                            </button>
                          )}
                          {canDeleteReminders && (
                            <button
                              onClick={() => {
                                setSelectedReminder(reminder);
                                setIsDeleteOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                              title="លុប"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
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
              ទំព័រទី{" "}
              <span className="font-bold text-white">{currentPage}</span> នៃ{" "}
              <span className="font-bold text-white">{lastPage}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 rounded-xl transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveReminder}
        initialData={selectedReminder}
        loading={actionLoading}
      />

      <DeleteReminderModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteReminder}
        title={selectedReminder?.title}
        loading={actionLoading}
      />
    </div>
  );
};

export default ReminderList;
