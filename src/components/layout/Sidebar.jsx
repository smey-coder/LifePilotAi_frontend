import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Bot,
  Users,
  Settings,
  ShieldCheck,
  Key,
  Sparkles,
  X,
  StickyNote,
  Bell,
  Target,
  Activity,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, closeSidebar }) => {
  // Extract Roles and Permissions directly from Auth Context
  const { roles = [], permissions = [] } = useAuth();

  // 1. Check Roles (Case-insensitive)
  const isAdmin = roles.some(
    (role) => typeof role === "string" && role.toLowerCase() === "admin",
  );

  // 2. Helper Check Permission (Admins pass automatically)
  const hasPermission = (permName) => {
    if (isAdmin) return true;
    return permissions.some(
      (p) =>
        typeof p === "string" && p.toLowerCase() === permName.toLowerCase(),
    );
  };

  const navigationMenu = [
    {
      title: "ទូទៅ",
      items: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
          show: true,
        },
        {
          name: "Task Management",
          path: "/tasks",
          icon: CheckSquare,
          show: hasPermission("tasks.view"),
        },
        {
          name: "កត់ត្រា (Notes)",
          path: "/notes",
          icon: StickyNote,
          show: hasPermission("notes.view"),
        },
        {
          name: "រំលឹក (Reminders)",
          path: "/reminders",
          icon: Bell,
          show: hasPermission("reminders.view"),
        },
        {
          name: "គោលដៅ (Goals)",
          path: "/goals",
          icon: Target,
          show: hasPermission("goals.view"),
        },
        {
          name: "ទម្លាប់ (Habits)",
          path: "/habits",
          icon: Activity,
          show: hasPermission("habits.view"),
        },
      ],
    },
    {
      title: "ជំនួយការ AI",
      items: [
        {
          name: "AI Assistant",
          path: "/ai-assistant",
          icon: Bot,
          badge: "AI",
          show: true,
        },
      ],
    },
    {
      title: "ការគ្រប់គ្រង (Management)",
      items: [
        {
          name: "អ្នកប្រើប្រាស់ (Users)",
          path: "/admin/users",
          icon: Users,
          show: hasPermission("users.view"),
        },
        {
          name: "គ្រប់គ្រង Roles",
          path: "/admin/roles",
          icon: ShieldCheck,
          show: hasPermission("roles.view"),
        },
        {
          name: "គ្រប់គ្រង Permissions",
          path: "/admin/permissions",
          icon: Key,
          show: hasPermission("permissions.view"),
        },
        {
          name: "ការកំណត់ (Settings)",
          path: "/settings",
          icon: Settings,
          show: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-50 text-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-200 shrink-0 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/80 shrink-0 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/20">
                LP
              </div>
              <span className="text-base font-black tracking-wider text-slate-900 uppercase dark:text-white">
                LifePilot <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg lg:hidden transition dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Navigation Items */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
            {navigationMenu.map((section, idx) => {
              const visibleItems = section.items.filter((item) => item.show);
              if (visibleItems.length === 0) return null;

              return (
                <div key={idx}>
                  <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 dark:text-slate-400">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={closeSidebar}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60"
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-700 rounded border border-amber-500/30 dark:text-amber-300">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Pro Badge Container */}
          <div className="p-4 border-t border-slate-200/80 shrink-0 dark:border-slate-800/80">
            <div className="p-3 bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/50 border border-indigo-500/20 rounded-2xl shadow-inner">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  Pro Plan Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                អត្ថប្រយោជន៍ AI គ្មានដែនកំណត់
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
