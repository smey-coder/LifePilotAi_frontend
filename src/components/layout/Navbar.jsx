import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Navbar = ({ user, roles = [], permissions = [], toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 1. State សម្រាប់ Logout Modal
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);

    try {
      await logout();
    } catch (error) {
      console.warn("Logout failed:", error);
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      navigate("/login", { replace: true });
    }
  };

  const isAdmin = roles.includes("Admin");
  const canCreateTask = permissions.includes("create tasks") || isAdmin;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side: Toggle Sidebar Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition lg:hidden"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800 hidden sm:inline-block">
                Dashboard
              </span>
              {isAdmin && (
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Actions, Notifications & Profile */}
          <div className="flex items-center gap-3">
            {canCreateTask && (
              <button
                onClick={() => navigate("/tasks/create")}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">បង្កើតកិច្ចការ</span>
              </button>
            )}

            {/* Notifications */}
            <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {roles[0] || "Member"}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Menu Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User size={16} className="text-slate-400" />{" "}
                      ព័ត៌មានផ្ទាល់ខ្លួន
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    {/* ប៊ូតុងចុចដើម្បីបង្ហាញ Confirm Modal */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut size={16} /> ចាកចេញពីប្រព័ន្ធ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-slide-up relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            >
              <X size={18} />
            </button>

            {/* Icon Warning Header */}
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <AlertTriangle size={24} />
            </div>

            {/* Modal Title & Message */}
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              តើអ្នកប្រាកដជាចង់ចាកចេញមែនទេ?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              ការចាកចេញនឹងបញ្ចប់ Session របស់អ្នកនាពេលបច្ចុប្បន្ន។
              អ្នកនឹងត្រូវចូលប្រព័ន្ធម្តងទៀតដើម្បីប្រើប្រាស់ប្រព័ន្ធ។
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition active:scale-95"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-200 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <LogOut size={16} />
                <span>ចាកចេញ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
