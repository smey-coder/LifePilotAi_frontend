import React, { useState, useEffect } from 'react';
import { X, FileText, Pin, Tag, Folder } from 'lucide-react';

const NoteModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || 'General');
      setTags(Array.isArray(initialData.tags) ? initialData.tags : []);
      setIsPinned(Boolean(initialData.is_pinned));
      setTagInput('');
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setTags([]);
      setIsPinned(false);
      setTagInput('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim() || null,
      category: category.trim() || 'General',
      tags,
      is_pinned: isPinned,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'កែប្រែ Note' : 'បង្កើត Note ថ្មី'}
              </h3>
              <p className="text-xs text-slate-400">កត់ត្រាគំនិត ឬព័ត៌មានសំខាន់ៗរបស់អ្នក</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-xs font-semibold text-slate-300">
                ចំណងជើង Note <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="បញ្ចូលចំណងជើង..."
                required
                className="w-full px-4 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`mt-5 p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                isPinned
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Pin size={16} className={isPinned ? 'fill-amber-400 text-amber-400' : ''} />
              <span>{isPinned ? 'Pinned' : 'Pin'}</span>
            </button>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              ប្រភេទ (Category)
            </label>
            <div className="relative">
              <Folder size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="ឧ. Work, Personal, Ideas..."
                className="w-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              ខ្លឹមសារកត់ត្រា (Content)
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="សរសេរខ្លឹមសារលម្អិតនៅទីនេះ..."
              className="w-full p-4 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500 transition leading-relaxed"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              Tags (វាយឈ្មោះ Tag រួចចុច Enter)
            </label>
            <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-wrap gap-2 items-center min-h-[42px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-1.5"
                >
                  <Tag size={11} />
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-rose-400">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "បន្ថែម tag..." : ""}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none px-2 min-w-[100px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-xl shadow-lg shadow-amber-600/30 transition"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{initialData ? 'រក្សាទុកការកែប្រែ' : 'បង្កើត Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;