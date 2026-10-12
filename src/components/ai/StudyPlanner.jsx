import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Cpu,
  Clock,
  Target,
  BookOpen,
  ArrowRight
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";

const StudyPlanner = ({ onSwitchToChat }) => {
  const { showSuccess, showError } = useNotification();

  const [subject, setSubject] = useState("");
  const [durationDays, setDurationDays] = useState("7");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [goal, setGoal] = useState("");
  const [provider, setProvider] = useState("groq"); // កំណត់ Groq ជា Default
  
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!subject.trim() || loading) return;

    setLoading(true);
    setPlanResult("");

    const promptMessage = `សូមជួយរៀបចំកាលវិភាគ និងផែនការសិក្សា (Study Plan & Roadmap) ឱ្យបានលម្អិតជាភាសាខ្មែរសម្រាប់៖
- មុខវិជ្ជា/ជំនាញ៖ ${subject}
- រយៈពេលសរុប៖ ${durationDays} ថ្ងៃ
- ពេលវេលាសិក្សាក្នុងមួយថ្ងៃ៖ ${hoursPerDay} ម៉ោង
- គោលដៅចុងក្រោយ៖ ${goal || "យល់ដឹងច្បាស់លាស់ និងអាចអនុវត្តជាក់ស្តែងបាន"}

សូមរៀបចំជា Roadmap ចែកចេញជាថ្ងៃៗ ឬជាសប្តាហ៍ ព្រមទាំងប្រាប់ពីគន្លឹះសិក្សាឱ្យមានប្រសិទ្ធភាព។`;

    try {
      const response = await api.post("/ai/chat", {
        message: promptMessage,
        provider: provider,
      });

      const data = response.data;
      const reply = data?.message?.content || data?.reply || "គ្មានការឆ្លើយតបពី AI";
      setPlanResult(reply);
      showSuccess("រៀបចំផែនការសិក្សាជោគជ័យ!", "ជោគជ័យ");
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការបង្កើតផែនការសិក្សា");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!planResult) return;
    navigator.clipboard.writeText(planResult);
    setCopied(true);
    showSuccess("បានចម្លងផែនការសិក្សារួចរាល់", "ចម្លងជោគជ័យ");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col transition-all duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 shadow-inner">
              <Calendar size={24} />
            </div>
            AI Study Planner & Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Cpu size={13} className="text-amber-500" />
            ប្រព័ន្ធរៀបចំកាលវិភាគ និងផែនការសិក្សាឆ្លាតវៃ ដំណើរការដោយ៖{" "}
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

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Form Panel */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1.5">
                <BookOpen size={14} className="text-amber-500" />
                <span>មុខវិជ្ជា ឬប្រធានបទរៀន៖</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ឧទាហរណ៍៖ React.js, Python for Data Science..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <Calendar size={13} className="text-amber-500" />
                  <span>រយៈពេល (ថ្ងៃ)៖</span>
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  min="1"
                  max="365"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <Clock size={13} className="text-amber-500" />
                  <span>ម៉ោង/ថ្ងៃ៖</span>
                </label>
                <input
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  min="1"
                  max="24"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1.5">
                <Target size={14} className="text-amber-500" />
                <span>គោលដៅរំពឹងទុក (Goal)៖</span>
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="ឧទាហរណ៍៖ ចង់ចេះបង្កើត Web App ដោយខ្លួនឯង ឬប្រឡងជាប់..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-500 dark:bg-slate-950 dark:border-slate-800 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !subject.trim()}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/25 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>កំពុងរៀបចំ Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>បង្កើត Study Plan</span>
                </>
              )}
            </button>
          </form>

          {onSwitchToChat && (
            <button
              type="button"
              onClick={onSwitchToChat}
              className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-amber-600 hover:text-amber-500 flex items-center justify-center gap-1.5 transition"
            >
              <span>ចង់សួរសំណួរ AI បន្ថែម? ទៅកាន់ Chat</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Right Output Panel */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 lg:col-span-2 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Calendar size={15} className="text-amber-500" />
              <span>កាលវិភាគ និង Roadmap ដែលបានបង្កើត</span>
            </h2>

            {planResult && (
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
                <p className="text-xs text-slate-400 font-medium">Life Pilot កំពុងរៀបចំ Roadmap យ៉ាងល្អិតល្អន់សម្រាប់អ្នក...</p>
              </div>
            ) : !planResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                <Calendar size={40} className="stroke-[1.5]" />
                <p className="text-xs font-medium">បំពេញព័ត៌មានខាងឆ្វេង ដើម្បីបង្កើត Study Plan ដំបូងរបស់អ្នក។</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans animate-fadeIn">
                {planResult}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudyPlanner;