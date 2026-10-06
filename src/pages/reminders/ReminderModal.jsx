import React, { useState, useEffect } from "react";
import { X, Bell, Calendar, Repeat, Send } from "lucide-react";

const ReminderModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [channel, setChannel] = useState("browser");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setRemindAt(
        initialData.remind_at ? initialData.remind_at.substring(0, 16) : "",
      );
      setFrequency(initialData.frequency || "once");
      setChannel(initialData.channel || "browser");
    } else {
      setTitle("");
      setRemindAt("");
      setFrequency("once");
      setChannel("browser");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !remindAt) return;

    onSubmit({
      title: title.trim(),
      remind_at: remindAt,
      frequency,
      channel,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl animate-scale-up max-h-[90vh] flex flex-col dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50 shrink-0 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Bell size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData
                  ? "កែប្រែការរំលឹក (Reminder)"
                  : "បង្កើតការរំលឹកថ្មី"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                កំណត់ពេលវេលា និង Channel រំលឹកព័ត៌មាន
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto custom-scrollbar"
        >
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              ចំណងជើងការរំលឹក <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ឧ. ប្រជុំជាមួយក្រុមការងារ, បង់ប្រាក់សេវា..."
              required
              className="w-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              ថ្ងៃ និងម៉ោងរំលឹក <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition [color-scheme:light] dark:text-white dark:bg-slate-950/60 dark:border-slate-800 dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ការសារឡើងវិញ (Frequency)
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition dark:text-white dark:bg-slate-950/60 dark:border-slate-800"
              >
                <option value="once">ម្តងគត់ (Once)</option>
                <option value="daily">រាល់ថ្ងៃ (Daily)</option>
                <option value="weekly">រាល់សប្តាហ៍ (Weekly)</option>
                <option value="monthly">រាល់ខែ (Monthly)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ប៉ុស្តិ៍រំលឹក (Notification Channel)
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition dark:text-white dark:bg-slate-950/60 dark:border-slate-800"
              >
                <option value="browser">Browser Push</option>
                <option value="email">Email Notification</option>
                <option value="telegram">Telegram Bot</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/60 dark:hover:bg-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !remindAt}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/30 transition"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>
                {initialData ? "រក្សាទុកការកែប្រែ" : "បង្កើតការរំលឹក"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
