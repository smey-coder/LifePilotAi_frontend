import React, { useState, useEffect } from "react";
import { X, CheckSquare, Calendar, Flag, AlignLeft } from "lucide-react";

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "todo");
      setPriority(initialData.priority || "medium");
      setDueDate(
        initialData.due_date ? initialData.due_date.substring(0, 16) : "",
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl animate-scale-up max-h-[90vh] flex flex-col dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50 shrink-0 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <CheckSquare size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? "កែប្រែ Task" : "បង្កើត Task ថ្មី"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                រៀបចំ និងកំណត់ភារកិច្ចរបស់អ្នក
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
              ចំណងជើង Task <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="បញ្ចូលចំណងជើង Task..."
              required
              className="w-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              បរិយាយ (Description)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ព័ត៌មានលម្អិតបន្ថែម..."
                className="w-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:placeholder-slate-500 dark:bg-slate-950/60 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ស្ថានភាព (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:bg-slate-950/60 dark:border-slate-800"
              >
                <option value="todo">To Do (មិនទាន់ធ្វើ)</option>
                <option value="in_progress">In Progress (កំពុងធ្វើ)</option>
                <option value="done">Done (រួចរាល់)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                កម្រិតសំខាន់ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition dark:text-white dark:bg-slate-950/60 dark:border-slate-800"
              >
                <option value="low">Low (ទាប)</option>
                <option value="medium">Medium (មធ្យម)</option>
                <option value="high">High (ខ្ពស់)</option>
                <option value="urgent">Urgent (បន្ទាន់)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              ថ្ងៃកំណត់ (Due Date)
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition [color-scheme:light] dark:text-white dark:bg-slate-950/60 dark:border-slate-800 dark:[color-scheme:dark]"
              />
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
              disabled={loading || !title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{initialData ? "រក្សាទុកការកែប្រែ" : "បង្កើត Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
