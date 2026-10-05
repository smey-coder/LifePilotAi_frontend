import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import useNotification from "../../hooks/useNotification";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCurrentUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.login(payload, formData.remember);

      const token =
        response?.access_token ??
        response?.token ??
        response?.data?.access_token ??
        response?.data?.token;

      if (token) {
        const user = await fetchCurrentUser();
        if (user) {
          const from = location.state?.from?.pathname || "/dashboard";
          showSuccess("ចូលប្រព័ន្ធដោយជោគជ័យ!");
          navigate(from, { replace: true });
        } else {
          showError("បរាជ័យក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់");
        }
      } else {
        showError("មិនអាចទទួលបាន Token ចូលប្រព័ន្ធឡើយ");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
      } else {
        showError(
          err.response?.data?.message || "អុីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl shadow-indigo-950/10 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 animate-slide-up">
        {/* 1. LEFT SIDE: BRANDING, IMAGE & ANIMATION */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-10 flex flex-col justify-between text-white overflow-hidden hidden md:flex">
          {/* Background Ambient Glow & Overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Header */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LifePilot AI
            </span>
          </div>

          {/* Center Image & Card Feature */}
          <div className="relative z-10 my-8">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
                alt="LifePilot Dashboard Preview"
                className="w-full h-48 object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-300/20 text-indigo-200 text-xs font-medium w-fit mb-2">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>AI Productivity Platform</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  រៀបចំជីវិត និងការងារដោយភាពឆ្លាតវៃ
                </h3>
              </div>
            </div>

            {/* Floating Feature Tags */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>គ្រប់គ្រង Task, Goal & Habit ក្នុងកន្លែងតែមួយ</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-100/90 bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>AI Chat Assistant ជួយរៀបចំ Schedule ស្វ័យប្រវត្តិ</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-xs text-indigo-200/60">
            © {new Date().getFullYear()} LifePilot AI. All rights reserved.
          </div>
        </div>

        {/* 2. RIGHT SIDE: FORM CONTENT */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ចូលប្រើប្រាស់ប្រព័ន្ធ
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              សូមបញ្ចូលអុីមែល និងពាក្យសម្ងាត់ដើម្បីចូលទៅកាន់ LifePilot AI
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Status Message from Redirect */}
          {location.state?.message && (
            <div
              className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-sm text-emerald-700 flex items-center gap-2"
              role="status"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{location.state.message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                អុីមែល
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
                <span className="text-xs text-red-500 mt-1.5 block font-medium">
                  {fieldErrors.email[0]}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ពាក្យសម្ងាត់
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.password && (
                <span className="text-xs text-red-500 mt-1.5 block font-medium">
                  {fieldErrors.password[0]}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-800 transition">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                />
                <span>ចងចាំខ្ញុំ (Remember me)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <span>កំពុងផ្ទៀងផ្ទាត់...</span>
              ) : (
                <>
                  <span>ចូលប្រព័ន្ធ</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            មិនទាន់មានគណនី?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition ml-1"
            >
              ចុះឈ្មោះនៅទីនេះ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
