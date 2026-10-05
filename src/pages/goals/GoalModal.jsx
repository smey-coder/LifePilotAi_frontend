import React, { useState, useEffect } from 'react';
import { Target, X, Plus, Trash2 } from 'lucide-react';

export default function GoalModal({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState('on_track');
  const [milestones, setMilestones] = useState(['']);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTargetDate(initialData.target_date || '');
      setStatus(initialData.status || 'on_track');
      setMilestones(
        initialData.milestones && initialData.milestones.length > 0
          ? initialData.milestones.map((m) => m.title)
          : ['']
      );
    } else {
      setTitle('');
      setDescription('');
      setTargetDate('');
      setStatus('on_track');
      setMilestones(['']);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddMilestone = () => setMilestones([...milestones, '']);

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index, value) => {
    const updated = [...milestones];
    updated[index] = value;
    setMilestones(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      target_date: targetDate || null,
      status,
      milestones: milestones.filter((m) => m.trim() !== ''),
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'កែប្រែគោលដៅ' : 'បង្កើតគោលដៅថ្មី'}
              </h2>
              <p className="text-[11px] text-slate-400">កំណត់គោលដៅ និង Milestones ដើម្បីតាមដាន Progress</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              ចំណងជើងគោលដៅ (Goal Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ឧ. រៀនភាសាអង់គ្លេសឱ្យស្ទាត់"
              className="w-full px-3.5 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              ការពិពណ៌នា (Description)
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ការពិពណ៌នាបន្ថែមពីគោលដៅ..."
              className="w-full px-3.5 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                កាលបរិច្ឆេទបញ្ចប់ (Target Date)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs text-white bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                ស្ថានភាព (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="on_track">On Track</option>
                <option value="behind">Behind</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dynamic Milestones Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Milestones Breakdown
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {milestones.map((ms, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ms}
                    onChange={(e) => handleMilestoneChange(index, e.target.value)}
                    placeholder={`Milestone #${index + 1}`}
                    className="flex-1 px-3.5 py-2 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                  />
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 pt-1 transition"
            >
              <Plus size={14} />
              <span>បន្ថែម Milestone</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              <span>{loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}