import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle, Sparkles } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 animate-slide-up">
        
        {/* Animated Badge & Icon Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md">
          <Sparkles size={14} className="text-amber-400" />
          <span>Error 404 - Page Not Found</span>
        </div>

        {/* Big 404 Graphic Number */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-600 drop-shadow-2xl select-none mb-2">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          រកមិនឃើញទំព័រដែលអ្នកកំពុងស្វែងរកទេ!
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          ទំព័រនេះអាចត្រូវ​បានលុប ដោះដូរឈ្មោះ ឬមិនទាន់មានក្នុងប្រព័ន្ធ LifePilot AI ឡើយ។
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-2xl text-xs sm:text-sm font-semibold transition duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>ត្រឡប់ទៅទំព័រមុន</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Home size={18} />
            <span>ទៅកាន់ Dashboard</span>
          </Link>
        </div>

        {/* Search Suggestion Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex items-center justify-center gap-6 text-xs text-slate-500">
          <Link to="/tasks" className="hover:text-indigo-400 transition flex items-center gap-1.5">
            <Search size={14} /> Task Management
          </Link>
          <span>•</span>
          <Link to="/ai-assistant" className="hover:text-indigo-400 transition flex items-center gap-1.5">
            <HelpCircle size={14} /> AI Support
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;