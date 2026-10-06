import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api"; // Adjust the import path based on your project structure

const UserSettings = () => {
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/settings");
      if (res.data.success) {
        setProfile({
          name: res.data.data.user.name || "",
          email: res.data.data.user.email || "",
        });
      }
    } catch (err) {
      setError("Failed to load user profile settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await api.put("/user/profile", profile);
      if (res.data.success) {
        setMessage(res.data.message || "Profile updated successfully.");
        localStorage.setItem("lifepilot_user_name", profile.name);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile details."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setMessage(null);
    setError(null);

    if (passwords.new_password !== passwords.new_password_confirmation) {
      setError("New password and confirmation do not match.");
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await api.put("/user/password", passwords);
      if (res.data.success) {
        setMessage("Password updated successfully.");
        setPasswords({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500 dark:text-neutral-400">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <span className="text-sm font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          User Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Manage your account profile and change security authentication parameters.
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

      {/* Profile Section */}
      <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-neutral-900">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Profile Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Update your account display name and primary email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
              disabled={profileSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {profileSaving ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-neutral-900">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Shield size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Password & Security
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Update your account password.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwords.current_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, current_password: e.target.value })
                }
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Lock
                className="absolute left-3 top-2.5 text-slate-400 dark:text-neutral-500"
                size={16}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Lock
                className="absolute left-3 top-2.5 text-slate-400 dark:text-neutral-500"
                size={16}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwords.new_password_confirmation}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    new_password_confirmation: e.target.value,
                  })
                }
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Lock
                className="absolute left-3 top-2.5 text-slate-400 dark:text-neutral-500"
                size={16}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {passwordSaving ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;