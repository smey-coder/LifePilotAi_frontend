import React, { useState, useEffect } from "react";
import { X, Flame } from "lucide-react";

const HabitModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    frequency: "daily",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        frequency: initialData.frequency || "daily",
      });
    } else {
      setFormData({
        title: "",
        frequency: "daily",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative dark:bg-slate-900 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/50 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 dark:text-white">
          <Flame className="text-amber-500" size={22} />
          <span>{initialData ? "កែប្រែទម្លាប់" : "បង្កើតទម្លាប់ថ្មី"}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              ឈ្មោះទម្លាប់ *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="ឧ. រត់ប្រាណព្រឹក 20 នាទី..."
              className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500/60 transition-all dark:text-white dark:bg-slate-950/60 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 dark:text-slate-300">
              ចន្លោះពេល (Frequency)
            </label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500/60 cursor-pointer dark:text-slate-200 dark:bg-slate-950/60 dark:border-slate-800"
            >
              <option value="daily">រៀងរាល់ថ្ងៃ (Daily)</option>
              <option value="weekdays">ថ្ងៃធ្វើការ (Weekdays)</option>
              <option value="weekly">រៀងរាល់សប្តាហ៍ (Weekly)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
