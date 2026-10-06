import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Shield,
  ChevronDown,
  Plus,
  AlertTriangle,
  X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import api from "../../services/api";
import TaskModal from "../../pages/tasks/TaskModal";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import UserProfile from "../../pages/profile/UserProfile";

const Navbar = ({
  user,
  roles = [],
  permissions = [],
  toggleSidebar,
  onTaskCreated,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Task Creation Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const { logout } = useAuth();
  const { showSuccess, showError } = useNotification();

  // 1. Scroll detection for dynamic border/shadow effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showProfileModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setShowProfileModal(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showProfileModal]);

  // Handle Logout Confirmation
  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      console.warn("Logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  // Handle Task Creation Submission
  const handleSaveTask = async (taskFormData) => {
    setTaskSubmitting(true);
    try {
      const response = await api.post("/tasks", taskFormData);
      showSuccess("បានបង្កើតកិច្ចការថ្មីដោយជោគជ័យ");
      setIsTaskModalOpen(false);

      if (typeof onTaskCreated === "function") {
        onTaskCreated(response.data);
      }
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការបង្កើតកិច្ចការ");
    } finally {
      setTaskSubmitting(false);
    }
  };

  // RBAC Checks
  const userRoles = (user?.roles || roles).map((r) =>
    typeof r === "string" ? r.toLowerCase() : r.name?.toLowerCase(),
  );
  const isAdmin = userRoles.includes("admin") || userRoles.includes("super admin");
  const isUser = userRoles.includes("user") || userRoles.includes("member");

  const userPerms = (user?.permissions || permissions).map((p) =>
    typeof p === "string" ? p.toLowerCase() : p.name?.toLowerCase(),
  );
  const canCreateTask =
    isAdmin || isUser ||
    userPerms.includes("tasks.create") ||
    userPerms.includes("tasks.manage") ||
    userPerms.includes("create tasks");

  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Fixed Header with Scroll Backdrop Effects */}
      <header
        className={`fixed top-0 right-0 left-0 lg:left-64 z-30 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 text-slate-900 backdrop-blur-xl border-b border-slate-200 shadow-2xl shadow-slate-200/60 py-2.5 dark:bg-slate-950/90 dark:text-white dark:border-slate-800 dark:shadow-slate-950/50"
            : "bg-white/80 text-slate-900 backdrop-blur-md border-b border-slate-200/80 py-3 dark:bg-slate-900/60 dark:text-white dark:border-slate-800/50"
        } px-4 sm:px-6`}
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left Side: Toggle Sidebar & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition lg:hidden active:scale-95 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              {/* <span className="text-lg font-black text-slate-900 tracking-tight hidden sm:inline-block dark:text-white">
                Dashboard
              </span> */}
              {isAdmin && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full flex items-center gap-1 shadow-inner dark:text-amber-400">
                  <Shield size={12} /> Admin
                </span>
              )}
              {isUser && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full flex items-center gap-1 shadow-inner dark:text-blue-400">
                  <User size={12} /> User
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Quick Actions, Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Create Task Button */}
            {canCreateTask && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 active:scale-95"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">បង្កើតកិច្ចការ</span>
              </button>
            )}
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition active:scale-95 border border-slate-200 dark:border-slate-800"
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>
            {/* Notifications Button */}
            <button
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition relative active:scale-95 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
              title="ការជូនដំណឹង"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-200 rounded-2xl border border-transparent hover:border-slate-200 transition-all duration-200 active:scale-95 dark:hover:bg-slate-800/60 dark:hover:border-slate-800"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-black text-xs shadow-md border border-indigo-400/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-700 leading-tight dark:text-slate-200">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium capitalize dark:text-slate-400">
                    {userRoles[0] || "Member"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user?.email || "user@lifepilot.ai"}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors"
                    >
                      <User size={15} className="text-indigo-400" />
                      <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800/80 pt-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>ចាកចេញពីប្រព័ន្ធ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Embedded Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        loading={taskSubmitting}
      />

      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowProfileModal(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
              <h2
                id="profile-modal-title"
                className="text-sm font-semibold text-slate-900 dark:text-white"
              >
                ព័ត៌មានផ្ទាល់ខ្លួន
              </h2>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                aria-label="Close profile"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6">
              <UserProfile />
            </div>
          </section>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">
              តើអ្នកប្រាកដជាចង់ចាកចេញមែនទេ?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              ការចាកចេញនឹងបញ្ចប់ Session របស់អ្នកនាពេលបច្ចុប្បន្ន។
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutLoading}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition active:scale-95 disabled:opacity-50"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={logoutLoading}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <LogOut size={15} />
                <span>{logoutLoading ? "កំពុងចាកចេញ..." : "ចាកចេញ"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
