import React, { useState, useEffect } from "react";
import {
  Sliders,
  ShieldAlert,
  Bell,
  HardDrive,
  Save,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api"; // Adjust the import path based on your project structure

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    app_name: "LifePilot AI",
    maintenance_mode: false,
    allow_registration: true,
    two_factor_auth: false,
    max_login_attempts: 5,
    session_timeout_mins: 120,
    email_notifications: true,
    system_alerts: true,
    log_retention_days: 30,
  });

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/settings");
      if (res.data.success) {
        setForm(res.data.data);
      }
    } catch (err) {
      setError("Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.put("/admin/settings", form);
      if (res.data.success) {
        setMessage("Admin system settings updated successfully.");
        localStorage.setItem("lifepilot_app_name", form.app_name);
      }
    } catch (err) {
      setError("Failed to update platform settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.post("/admin/settings/clear-cache");
      if (res.data.success) {
        setMessage("System application cache successfully cleared.");
      }
    } catch (err) {
      setError("Failed to clear application cache.");
    } finally {
      setClearingCache(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500 dark:text-neutral-400">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <span className="text-sm font-medium">Loading system configurations...</span>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "security", label: "Security & Auth", icon: ShieldAlert },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System Operations", icon: HardDrive },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Admin Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Configure application variables, access throttles, maintenance modes, and cache options.
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 dark:border-neutral-800 gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                isActive
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "general" && (
          <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={form.app_name}
                onChange={(e) => handleChange("app_name", e.target.value)}
                className="w-full max-w-md px-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-900">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Public User Registration</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Allow public visitors to create new user accounts.</p>
              </div>
              <input
                type="checkbox"
                checked={form.allow_registration}
                onChange={(e) => handleChange("allow_registration", e.target.checked)}
                className="h-5 w-5 accent-indigo-500 rounded-sm cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Enforce Two-Factor Auth (2FA)</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Mandate multi-factor authentication for administrative accounts.</p>
              </div>
              <input
                type="checkbox"
                checked={form.two_factor_auth}
                onChange={(e) => handleChange("two_factor_auth", e.target.checked)}
                className="h-5 w-5 accent-indigo-500 rounded-sm cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Max Login Throttles
                </label>
                <input
                  type="number"
                  value={form.max_login_attempts}
                  onChange={(e) => handleChange("max_login_attempts", parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Session Expiry (Minutes)
                </label>
                <input
                  type="number"
                  value={form.session_timeout_mins}
                  onChange={(e) => handleChange("session_timeout_mins", parseInt(e.target.value) || 15)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  min="15"
                  max="1440"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Mailer Pipeline</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Dispatch outbound SMTP transactional emails.</p>
              </div>
              <input
                type="checkbox"
                checked={form.email_notifications}
                onChange={(e) => handleChange("email_notifications", e.target.checked)}
                className="h-5 w-5 accent-indigo-500 rounded-sm cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">System Health Telemetry Alerts</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Send notifications during database query latency spikes.</p>
              </div>
              <input
                type="checkbox"
                checked={form.system_alerts}
                onChange={(e) => handleChange("system_alerts", e.target.checked)}
                className="h-5 w-5 accent-indigo-500 rounded-sm cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Platform Maintenance Mode</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Puts system into HTTP 503 Service Unavailable state for non-admin accounts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.maintenance_mode}
                onChange={(e) => handleChange("maintenance_mode", e.target.checked)}
                className="h-5 w-5 accent-rose-500 rounded-sm cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">System Cache Manager</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Flush config, route, and application memory caches.</p>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                disabled={clearingCache}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {clearingCache ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                <span>Flush Cache</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;