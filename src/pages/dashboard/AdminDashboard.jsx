import React, { useEffect, useState } from "react";
import { Users, ShieldCheck, Cpu, Database, ArrowUpRight, Loader2, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

// Mock chart data (or replace with real arrays returned from Laravel API)
const analyticsData = [
  { time: "00:00", users: 320, sessions: 210 },
  { time: "04:00", users: 240, sessions: 180 },
  { time: "08:00", users: 680, sessions: 520 },
  { time: "12:00", users: 1100, sessions: 890 },
  { time: "16:00", users: 1248, sessions: 940 },
  { time: "20:00", users: 980, sessions: 760 },
];

const dbLatencyData = [
  { hour: "12 AM", latency: 45 },
  { hour: "04 AM", latency: 32 },
  { hour: "08 AM", latency: 88 },
  { hour: "12 PM", latency: 120 },
  { hour: "04 PM", latency: 84 },
  { hour: "08 PM", latency: 55 },
];

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        const response = await api.get("/dashboard/admin");
        if (response.data.success) {
          setAdminData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load admin metrics:", err);
        setError("Unable to connect to platform telemetry.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] text-slate-500 dark:text-neutral-400 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <span className="text-sm font-medium">Fetching telemetry & analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium">
        {error}
      </div>
    );
  }

  const { metrics, recent_users, system_health } = adminData || {};

  const stats = [
    { title: "Total Platform Users", value: metrics?.total_users ?? "1,248", change: "+12.5%", icon: Users },
    { title: "Active RBAC Roles", value: `${metrics?.active_roles ?? 6} Roles`, change: "Secure", icon: ShieldCheck },
    { title: "System CPU Load", value: metrics?.system_load ?? "24.2%", change: "Optimal", icon: Cpu },
    { title: "PostgreSQL Latency", value: metrics?.db_latency ?? "84ms", change: "Fast", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Control Center</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Real-time analytics, RBAC permissions, and PostgreSQL health telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold w-fit">
          <Activity size={14} className="animate-pulse" />
          <span>PostgreSQL Cluster Online</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 rounded-2xl transition-all duration-300 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">{stat.title}</span>
                <div className="p-2 bg-slate-100 dark:bg-neutral-900 rounded-xl text-slate-700 dark:text-neutral-300">
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main User Activity Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Active Traffic & Daily Sessions</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Platform usage over 24 hours</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.3} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PostgreSQL Performance Bar Chart */}
        <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">PostgreSQL Latency</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Average query speed in milliseconds (ms)</p>
          </div>

          <div className="h-52 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dbLatencyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#888" }} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="latency" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-between items-center text-xs text-slate-500 dark:text-neutral-400">
            <span>Pool Capacity: <strong className="text-slate-800 dark:text-neutral-200">42%</strong></span>
            <span>Status: <strong className="text-emerald-500">Optimal</strong></span>
          </div>
        </div>
      </div>

      {/* Tables & System Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Registrations Table */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Registrations</h2>
            <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              View All Users
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-neutral-900">
            {recent_users?.map((usr) => (
              <div key={usr.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{usr.name}</p>
                  <p className="text-xs text-slate-500 dark:text-neutral-500">{usr.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 font-medium">
                    {usr.role}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    {usr.joined}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Allocation Bars */}
        <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Resource Allocation</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-600 dark:text-neutral-400">PostgreSQL Connection Pool</span>
                <span className="text-slate-900 dark:text-white">{system_health?.postgres_pool_usage ?? 42}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${system_health?.postgres_pool_usage ?? 42}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-600 dark:text-neutral-400">Laravel Redis Cache</span>
                <span className="text-slate-900 dark:text-white">{system_health?.laravel_cache_usage ?? 68}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${system_health?.laravel_cache_usage ?? 68}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-600 dark:text-neutral-400">API Queue Throughput</span>
                <span className="text-slate-900 dark:text-white">99.8%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "99.8%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;