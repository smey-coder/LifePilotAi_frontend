import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock, KeyRound } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 animate-slide-up">
        
        {/* Animated Shield Icon Header */}
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-md">
          <ShieldAlert size={42} />
        </div>

        {/* Error Code & Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
          <Lock size={12} />
          <span>Access Denied - 403 Forbidden</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          អ្នកគ្មានសិទ្ធិចូលប្រើប្រាស់ទំព័រនេះទេ!
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          គណនីរបស់អ្នកមិនទាន់មាន Role ឬ Permission (សិទ្ធិគ្រប់គ្រង) គ្រប់គ្រាន់សម្រាប់ចូលទៅកាន់ផ្នែកនេះឡើយ។ សូមទាក់ទង Admin ប្រសិនបើអ្នកត្រូវការសិទ្ធិចូលប្រើ។
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-2xl text-xs sm:text-sm font-semibold transition duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>ត្រឡប់ថយក្រោយ</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Home size={18} />
            <span>ត្រឡប់ទៅ Dashboard</span>
          </Link>
        </div>

        {/* Security Note Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-center gap-2">
          <KeyRound size={14} className="text-slate-400" />
          <span>ការចូលប្រើប្រាស់ត្រូវបានការពារដោយ Role-Based Access Control (RBAC)</span>
        </div>

      </div>
    </div>
  );
};

export default Unauthorized;