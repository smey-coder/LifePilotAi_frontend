import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { authService } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // មុខងារ Redirect ទៅកាន់ Google Auth API Endpoint របស់ Laravel
  const handleGoogleRegister = () => {
    const backendApiUrl = (
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"
    ).replace(/\/+$/, "");
    window.location.href = `${backendApiUrl}/auth/google/redirect`;
  };

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "bg-slate-200", text: "" };

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return {
          score: 25,
          label: "ខ្សោយ (Weak)",
          color: "bg-red-500",
          text: "text-red-500",
        };
      case 2:
        return {
          score: 50,
          label: "មធ្យម (Medium)",
          color: "bg-amber-500",
          text: "text-amber-500",
        };
      case 3:
        return {
          score: 75,
          label: "ល្អ (Good)",
          color: "bg-blue-500",
          text: "text-blue-500",
        };
      case 4:
        return {
          score: 100,
          label: "រឹងមាំខ្លាំង (Strong)",
          color: "bg-emerald-500",
          text: "text-emerald-500",
        };
      default:
        return { score: 0, label: "", color: "bg-slate-200", text: "" };
    }
  };

  const strength = getPasswordStrength(formData.password);
  const isConfirmFilled = formData.password_confirmation.length > 0;
  const isPasswordMatch =
    isConfirmFilled && formData.password === formData.password_confirmation;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage(
        "ពាក្យសម្ងាត់ និងការផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      if (response) {
        navigate("/login", {
          state: {
            message: "ការចុះឈ្មោះជោគជ័យ! សូមចូលប្រើប្រាស់គណនីរបស់អ្នក។",
          },
        });
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            "ការចុះឈ្មោះបានបរាជ័យ សូមព្យាយាមម្តងទៀត",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-5xl w-full min-h-[650px] bg-white rounded-3xl shadow-2xl shadow-indigo-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-slide-up">
        {/* LEFT SIDE: BRANDING */}
        <div className="md:col-span-5 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 lg:p-10 flex flex-col justify-between text-white overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LifePilot AI
            </span>
          </div>

          <div className="relative z-10 my-6">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                alt="LifePilot Registration Feature"
                className="w-full h-44 object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-300/20 text-indigo-200 text-xs font-medium w-fit mb-1.5">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>Free Trial Account</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  ចាប់ផ្តើមដំណើរកម្សាន្តផលិតភាពការងារ
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>បង្កើតគណនីឥតគិតថ្លៃក្នុងពេលបន្តិចទៀត</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <ShieldCheck size={16} className="text-indigo-300 shrink-0" />
                <span>សុវត្ថិភាពទិន្នន័យកម្រិតខ្ពស់ជាមួយ System</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-200/60">
            © {new Date().getFullYear()} LifePilot AI. All rights reserved.
          </div>
        </div>

        {/* RIGHT SIDE: REGISTER FORM WITH GOOGLE SINGLE SIGN-ON */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              បង្កើតគណនីថ្មី
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              សូមបញ្ចូលព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះប្រើប្រាស់ LifePilot AI
            </p>
          </div>

          {/* GOOGLE REGISTER BUTTON */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition duration-200 flex items-center justify-center gap-3 active:scale-[0.99] mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>ចុះឈ្មោះជាមួយ Google</span>
          </button>

          {/* DIVIDER */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs uppercase font-medium text-slate-400 shrink-0">
              ឬ ចុះឈ្មោះតាម អុីមែល
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                ឈ្មោះពេញ (Full Name)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition duration-200 outline-none"
                  placeholder="John Doe"
                />
              </div>
              {fieldErrors.name && (
                <span className="text-xs text-red-500 mt-1 block font-medium">
                  {fieldErrors.name[0]}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                អុីមែល (Email Address)
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
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

              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      កម្រិតសុវត្ថិភាពពាក្យសម្ងាត់៖
                    </span>
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

            {/* Password Confirmation */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់
                </label>
                {isConfirmFilled && (
                  <span
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      isPasswordMatch ? "text-emerald-600" : "text-red-500"
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
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 transition duration-200 outline-none ${
                    isConfirmFilled
                      ? isPasswordMatch
                        ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10"
                        : "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
                <span>កំពុងបង្កើតគណនី...</span>
              ) : (
                <>
                  <span>ចុះឈ្មោះបង្កើតគណនី</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            មានគណនីរួចហើយ?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              ចូលប្រើប្រាស់នៅទីនេះ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
