import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Cpu,
  Layers,
  BookOpen
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";
import useAuth from "../../hooks/useAuth";

const NotesSummary = () => {
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();

  const [inputText, setInputText] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("groq"); // កំណត់ Groq ជា Default
  const [copied, setCopied] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState("");

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const response = await api.get("/notes?per_page=20");
        const data = response.data?.data?.data || response.data?.data || [];
        setNotesList(Array.isArray(data) ? data : []);
      } catch (err) {
        // Silent catch
      }
    };
    fetchUserNotes();
  }, []);

  const handleNoteSelect = (e) => {
    const noteId = e.target.value;
    setSelectedNoteId(noteId);
    if (!noteId) {
      setInputText("");
      return;
    }
    const found = notesList.find((n) => String(n.id) === String(noteId));
    if (found) {
      setInputText(found.content || found.title || "");
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setSummaryResult("");

    try {
      const response = await api.post("/ai/chat", {
        message: `សូមជួយសង្ខេបអត្ថបទខាងក្រោមនេះជារូបភាពចំណុចសំខាន់ៗ (Bullet points) និងសេចក្តីសន្និដ្ឋានខ្លីច្បាស់លាស់ជាភាសាខ្មែរ៖\n\n${inputText}`,
        provider: provider,
      });

      const data = response.data;
      const reply = data?.message?.content || data?.reply || "គ្មានការឆ្លើយតបពី AI";
      setSummaryResult(reply);
      showSuccess("បានសង្ខេបអត្ថបទដោយជោគជ័យ!", "ជោគជ័យ");
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការតភ្ជាប់ទៅកាន់ AI សង្ខេបអត្ថបទ");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setCopied(true);
    showSuccess("បានចម្លងអត្ថបទរួចរាល់", "ចម្លងជោគជ័យ");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col transition-all duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 shadow-inner">
              <FileText size={24} />
            </div>
            AI Notes Summary & Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Cpu size={13} className="text-amber-500" />
            មុខងារសង្ខេបឯកសារ និងកំណត់ត្រាវែងៗឱ្យខ្លីងាយយល់ ដំណើរការដោយ៖{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-md uppercase tracking-wide">
              {provider === 'gemini' ? 'Gemini 3.8 Flash' : provider === 'openai' ? 'GPT-4o-mini' : 'Groq Llama 3.3'}
            </span>
          </p>
        </div>

        {/* Triple Provider Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setProvider("groq")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "groq"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Zap size={13} />
            Groq AI
          </button>
          <button
            onClick={() => setProvider("gemini")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "gemini"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            Gemini 3.8
          </button>
          <button
            onClick={() => setProvider("openai")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "openai"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            OpenAI GPT
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left Column */}
        <div className="flex flex-col bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 dark:shadow-none overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BookOpen size={15} className="text-amber-500" />
              <span>បញ្ចូលអត្ថបទ ឬជ្រើសរើស Note របស់អ្នក៖</span>
            </label>

            {notesList.length > 0 && (
              <select
                value={selectedNoteId}
                onChange={handleNoteSelect}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- ជ្រើសរើសពី Smart Notes --</option>
                {notesList.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <form onSubmit={handleSummarize} className="flex flex-col flex-1 min-h-0 gap-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="បិទភ្ជាប់ (Paste) អត្ថបទវែងៗ ឯកសារ ឬកំណត់ត្រាដែលអ្នកចต้องการឱ្យ AI សង្ខេបនៅទីនេះ..."
              className="flex-1 w-full p-4 text-xs bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-200 dark:bg-slate-950/60 dark:border-slate-800 dark:text-white placeholder-slate-400 resize-none custom-scrollbar"
              required
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/25 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 text-xs shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>កំពុងវិភាគ និងសង្ខេបអត្ថបទ...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>ចាប់ផ្តើមសង្ខេបអត្ថបទ (Summarize)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column */}
        <div className="flex flex-col bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 dark:shadow-none overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers size={15} className="text-amber-500" />
              <span>លទ្ធផលសង្ខេបពី AI (Summary Result)</span>
            </h2>

            {summaryResult && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? "បានចម្លង" : "ចម្លង"}</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 border border-slate-200/60 rounded-2xl dark:bg-slate-950/50 dark:border-slate-800/60 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw size={32} className="animate-spin text-amber-500" />
                <p className="text-xs text-slate-400 font-medium">Life Pilot កំពុងអាន និងចម្រាញ់ចំណុចសំខាន់ៗ...</p>
              </div>
            ) : !summaryResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                <FileText size={40} className="stroke-[1.5]" />
                <p className="text-xs font-medium">លទ្ធផលសង្ខេបនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីអ្នកចុចប៊ូតុងសង្ខេប។</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans animate-fadeIn">
                {summaryResult}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotesSummary;