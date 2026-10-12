import React, { useState } from "react";
import { MessageSquare, FileText, Calendar } from "lucide-react";
import AIAssistant from "../../pages/ai/AIAssistant";
import NotesSummary from "./NotesSummary";
import StudyPlanner from "./StudyPlanner";

const AIMainModule = () => {
  const [activeTab, setActiveTab] = useState("chat"); // 'chat', 'summary', 'planner'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Dynamic Navigation Sub-Header */}
      <div className="max-w-7xl mx-auto px-6 pt-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-2xl border-b-2 transition-all ${
            activeTab === "chat"
              ? "border-amber-500 text-amber-600 bg-amber-500/10 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <MessageSquare size={15} />
          <span>Life Assistant Chat</span>
        </button>

        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-2xl border-b-2 transition-all ${
            activeTab === "summary"
              ? "border-amber-500 text-amber-600 bg-amber-500/10 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileText size={15} />
          <span>Notes Summary</span>
        </button>

        <button
          onClick={() => setActiveTab("planner")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-2xl border-b-2 transition-all ${
            activeTab === "planner"
              ? "border-amber-500 text-amber-600 bg-amber-500/10 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Calendar size={15} />
          <span>Study Planner</span>
        </button>
      </div>

      {/* Render Active Component */}
      <div className="animate-fadeIn">
        {activeTab === "chat" && <AIAssistant />}
        {activeTab === "summary" && <NotesSummary />}
        {activeTab === "planner" && (
          <StudyPlanner onSwitchToChat={() => setActiveTab("chat")} />
        )}
      </div>
    </div>
  );
};

export default AIMainModule;