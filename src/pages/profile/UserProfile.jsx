import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";
import api from "../../services/api";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    id: null,
    name: "",
    email: "",
    created_at: "",
    roles: [],
    permissions: [],
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      if (res.data.success) {
        const data = res.data.data;
        setProfileData(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch user profile details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.put("/profile", form);
      if (res.data.success) {
        setMessage(res.data.message || "Profile updated successfully.");
        setProfileData((prev) => ({
          ...prev,
          name: form.name,
          email: form.email,
        }));
        localStorage.setItem("lifepilot_user_name", form.name);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500 dark:text-neutral-400">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <span className="text-sm font-medium">Loading profile information...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          User Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Overview of your account credentials, roles, and assigned permissions.
        </p>
      </div>

      {/* Alert Banners */}
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

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {profileData.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <Mail size={13} />
              {profileData.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profileData.roles.map((role, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize"
            >
              <Award size={12} />
              {role}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            <Calendar size={12} />
            Joined {profileData.created_at}
          </span>
        </div>
      </div>

      {/* Profile Details Edit Form */}
      <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-neutral-900">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Edit Profile Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Update your account display name and primary contact address.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <User
                  className="absolute left-3 top-2.5 text-slate-400 dark:text-neutral-500"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Mail
                  className="absolute left-3 top-2.5 text-slate-400 dark:text-neutral-500"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Permissions Badges */}
      <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-neutral-900">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Key size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Assigned Permissions
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Active capabilities granted via Spatie RBAC.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {profileData.permissions && profileData.permissions.length > 0 ? (
            profileData.permissions.map((permission, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800"
              >
                {permission}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500 dark:text-neutral-500 italic">
              No specific explicit permissions assigned. Inheriting default role privileges.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;