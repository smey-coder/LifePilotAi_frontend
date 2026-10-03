import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Sparkles, KeyRound, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setFieldError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success || response) {
        setMessage(
          response.message ||
            'តំណលីងកំណត់ពាក្យសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅអុីមែលរបស់អ្នករួចរាល់។ សូមពិនិត្យមើល Inbox ឬ Spam folder!'
        );
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldError(
          err.response.data.errors?.email?.[0] || 'អុីមែលមិនត្រឹមត្រូវ ឬមិនទាន់បានចុះឈ្មោះ'
        );
      } else {
        setError(
          err.response?.data?.message ||
            'មិនអាចផ្ញើអុីមែលបានទេ សូមពិនិត្យអុីមែលឡើងវិញ ឬព្យាយាមម្តងទៀត'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-5xl w-full min-h-[600px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-slide-up">
        
        {/* 1. LEFT SIDE: BRANDING, FEATURED IMAGE & ANIMATED CARDS (5/12) */}
        <div className="md:col-span-5 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 lg:p-10 flex flex-col justify-between text-white overflow-hidden hidden md:flex">
          
          {/* Subtle Glowing Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LifePilot AI
            </span>
          </div>

          {/* Interactive Feature Card & Image */}
          <div className="relative z-10 my-6">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
                alt="Account Recovery Illustration"
                className="w-full h-48 object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-300/20 text-indigo-200 text-xs font-medium w-fit mb-1.5">
                  <KeyRound size={12} className="text-amber-300" />
                  <span>Account Recovery</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  ការជួយសង្គ្រោះ និងសុវត្ថិភាពគណនី
                </h3>
              </div>
            </div>

            {/* Benefit Bullets */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>ដំណើរការកំណត់ពាក្យសម្ងាត់ប្រកបដោយសុវត្ថិភាព</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-indigo-300 shrink-0" />
                <span>ផ្ញើតំណលីង Reset ទៅកាន់ Email ដោយស្វ័យប្រវត្តិ</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-xs text-indigo-200/60">
            © {new Date().getFullYear()} LifePilot AI. All rights reserved.
          </div>
        </div>

        {/* 2. RIGHT SIDE: FORGOT PASSWORD FORM (7/12) */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          
          <div>
            {/* Top Back Navigation Link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition duration-200 mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>ត្រឡប់ទៅទំព័រចូលប្រើប្រាស់</span>
            </Link>

            {/* Heading Header */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100/50 shadow-sm">
                <KeyRound size={22} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ភ្លេចពាក្យសម្ងាត់?
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                កុំបារម្ភ! សូមបញ្ចូលអាសយដ្ឋានអុីមែលរបស់អ្នកនៅខាងក្រោម ពួកយើងនឹងផ្ញើតំណលីងសម្រាប់កំណត់ពាក្យសម្ងាត់ឡើងវិញ។
              </p>
            </div>

            {/* Success Alert Message */}
            {message && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-2xl border border-emerald-100 flex items-start gap-3 animate-fade-in shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            {/* Error Alert Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-center gap-3 animate-shake shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  អាសយដ្ឋានអុីមែល (Email Address)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition duration-200 outline-none"
                    placeholder="example@gmail.com"
                  />
                </div>
                {fieldError && (
                  <span className="text-xs text-red-500 mt-1.5 block font-medium">
                    {fieldError}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <span>កំពុងផ្ញើតំណលីង...</span>
                ) : (
                  <>
                    <span>ផ្ញើតំណលីង Reset</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            ចងចាំពាក្យសម្ងាត់ឡើងវិញ?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              ចូលប្រព័ន្ធនៅទីនេះ
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;