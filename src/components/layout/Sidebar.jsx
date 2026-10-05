import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, Bot, Users, 
  Settings, ShieldCheck, Key, Sparkles, X, StickyNote, Bell, Target, Activity
} from 'lucide-react';
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, closeSidebar }) => {
  // ទាញយក Roles និង Permissions ពី Auth Context ដោយផ្ទាល់
  const { roles = [], permissions = [] } = useAuth();

  // 1. ពិនិត្យមើល Roles (Case-insensitive មិនខ្លាចអក្សរតូចធំ)
  const isAdmin = roles.some(
    (role) => typeof role === 'string' && role.toLowerCase() === 'admin'
  );
  
  const isUser = roles.some(
    (role) => typeof role === 'string' && role.toLowerCase() === 'user'
  );

  // 2. Helper Check Permission (ប្រសិនបើជា Admin ឱ្យ True ទាំងអស់)
  const hasPermission = (permName) => {
    if (isAdmin) return true;
    return permissions.some(
      (p) => typeof p === 'string' && p.toLowerCase() === permName.toLowerCase()
    );
  };

  const navigationMenu = [
    {
      title: 'ទូទៅ',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          show: true,
        },
        {
          name: 'Task Management',
          path: '/tasks',
          icon: CheckSquare,
          show: hasPermission('tasks.view'),
        },
        {
          name: 'កត់ត្រា (Notes)',
          path: '/notes',
          icon: StickyNote,
          show: hasPermission('notes.view'),
        },
        {
          name: 'រំលឹក (Reminders)',
          path: '/reminders',
          icon: Bell,
          show: hasPermission('reminders.view'),
        },
        {
          name: 'គោលដៅ (Goals)',
          path: '/goals',
          icon: Target,
          show: hasPermission('goals.view'),
        },
        {
          name: 'ទម្លាប់ (Habits)',
          path: '/habits',
          icon: Activity,
          show: hasPermission('habits.view'),
        },
      ],
    },
    {
      title: 'ជំនួយការ AI',
      items: [
        {
          name: 'AI Assistant',
          path: '/ai-assistant',
          icon: Bot,
          badge: 'AI',
          show: true,
        },
      ],
    },
    {
      title: 'ការគ្រប់គ្រង (Management)',
      items: [
        {
          name: 'អ្នកប្រើប្រាស់ (Users)',
          path: '/admin/users',
          icon: Users,
          show: hasPermission('users.view'),
        },
        {
          name: 'គ្រប់គ្រង Roles',
          path: '/admin/roles',
          icon: ShieldCheck,
          show: hasPermission('roles.view'),
        },
        {
          name: 'គ្រប់គ្រង Permissions',
          path: '/admin/permissions',
          icon: Key,
          show: hasPermission('permissions.view'),
        },
        {
          name: 'ការកំណត់ (Settings)',
          path: '/settings',
          icon: Settings,
          show: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-600/30">
                P
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                LifePilot AI
              </span>
            </div>
            <button onClick={closeSidebar} className="text-slate-400 hover:text-white lg:hidden">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navigationMenu.map((section, idx) => {
              const visibleItems = section.items.filter((item) => item.show);
              if (visibleItems.length === 0) return null;

              return (
                <div key={idx}>
                  <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                            `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
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
        </div>

        {/* Bottom AI Plan Status */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-white">Pro Plan Active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              អត្ថប្រយោជន៍ AI គ្មានដែនកំណត់
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;