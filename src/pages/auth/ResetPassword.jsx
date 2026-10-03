import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, KeyRound, Check, X } from 'lucide-react';
import { authService } from '../../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    token: token,
    email: emailParam,
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // គណនាកម្រិតភាពរឹងមាំនៃពាក្យសម្ងាត់ (Password Strength Calculator)
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', text: '' };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'ខ្សោយ (Weak)', color: 'bg-red-500', text: 'text-red-500' };
      case 2:
        return { score: 50, label: 'មធ្យម (Medium)', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3:
        return { score: 75, label: 'ល្អ (Good)', color: 'bg-blue-500', text: 'text-blue-500' };
      case 4:
        return { score: 100, label: 'រឹងមាំខ្លាំង (Strong)', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default:
        return { score: 0, label: '', color: 'bg-slate-200', text: '' };
    }
  };

  const strength = getPasswordStrength(formData.password);

  // ពិនិត្យមើលភាពត្រូវគ្នានៃ Password Confirmation
  const isConfirmFilled = formData.password_confirmation.length > 0;
  const isPasswordMatch = isConfirmFilled && formData.password === formData.password_confirmation;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    if (formData.password !== formData.password_confirmation) {
      setServerError('ពាក្យសម្ងាត់ និងការផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(formData);
      if (response.success || response) {
        navigate('/login', {
          state: {
            message: 'កំណត់ពាក្យសម្ងាត់ឡើងវិញបានជោគជ័យ! សូមចូលប្រព័ន្ធជាមួយពាក្យសម្ងាត់ថ្មី។',
          },
        });
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else {
        setServerError(
          err.response?.data?.message ||
            'បរាជ័យក្នុងការកំណត់ពាក្យសម្ងាត់ឡើងវិញ សូមពិនិត្យមើលតំណលីងឡើងវិញ'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-5xl w-full min-h-[620px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-slide-up">
        
        {/* 1. LEFT SIDE: BRANDING, FEATURED IMAGE & ANIMATED CARDS (5/12) */}
        <div className="md:col-span-5 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 lg:p-10 flex flex-col justify-between text-white overflow-hidden hidden md:flex">
          
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

          {/* Feature Card Image */}
          <div className="relative z-10 my-6">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80"
                alt="Secure Password Reset Illustration"
                className="w-full h-44 object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-300/20 text-indigo-200 text-xs font-medium w-fit mb-1.5">
                  <KeyRound size={12} className="text-amber-300" />
                  <span>Secure Reset Token</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  ការពារគណនីរបស់អ្នកជាមួយពាក្យសម្ងាត់ថ្មី
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>ការអ៊ិនគ្រីបកម្រិតខ្ពស់ជាមួយ Laravel Sanctum</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-indigo-300 shrink-0" />
                <span>ផ្ទៀងផ្ទាត់ Token សុវត្ថិភាពដោយស្វ័យប្រវត្តិ</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-200/60">
            © {new Date().getFullYear()} LifePilot AI. All rights reserved.
          </div>
        </div>

        {/* 2. RIGHT SIDE: RESET PASSWORD FORM (7/12) */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition duration-200 mb-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>ត្រឡប់ទៅទំព័រចូលប្រើប្រាស់</span>
            </Link>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                កំណត់ពាក្យសម្ងាត់ថ្មី
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                សូមបញ្ចូលអុីមែល និងកំណត់ពាក្យសម្ងាត់ថ្មីដែលមានសុវត្ថិភាពខ្ពស់
              </p>
            </div>

            {serverError && (
              <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="token" value={formData.token} />

              {/* Email Address */}
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
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition duration-200 outline-none"
                    placeholder="example@gmail.com"
                  />
                </div>
                {fieldErrors.email && (
                  <span className="text-xs text-red-500 mt-1 block font-medium">
                    {fieldErrors.email[0]}
                  </span>
                )}
              </div>

              {/* New Password with Strength Meter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  ពាក្យសម្ងាត់ថ្មី
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition duration-200 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator Progress Bar */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">កម្រិតសុវត្ថិភាពពាក្យសម្ងាត់៖</span>
                      <span className={`font-semibold ${strength.text}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {fieldErrors.password && (
                  <span className="text-xs text-red-500 mt-1 block font-medium">
                    {fieldErrors.password[0]}
                  </span>
                )}
              </div>

              {/* Confirm New Password with Match Check */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី
                  </label>
                  {isConfirmFilled && (
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        isPasswordMatch ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {isPasswordMatch ? (
                        <>
                          <Check size={14} /> ត្រូវគ្នា (Matched)
                        </>
                      ) : (
                        <>
                          <X size={14} /> មិនត្រូវគ្នាទេ (Not Matched)
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 transition duration-200 outline-none ${
                      isConfirmFilled
                        ? isPasswordMatch
                          ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10'
                          : 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (isConfirmFilled && !isPasswordMatch)}
                className="w-full mt-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <span>កំពុងរក្សាទុក...</span>
                ) : (
                  <>
                    <span>រក្សាទុកពាក្យសម្ងាត់ថ្មី</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            ចងចាំពាក្យសម្ងាត់ឡើងវិញ?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              ចូលប្រព័ន្ធនៅទីនេះ
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default ResetPassword;