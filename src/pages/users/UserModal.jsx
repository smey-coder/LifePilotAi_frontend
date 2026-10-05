import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Lock, ShieldCheck, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData, availableRoles = [], loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [passwordError, setPasswordError] = useState('');

  // States សម្រាប់Toggle បង្ហាញ/លាក់ ពាក្យសម្ងាត់
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPassword('');
      setPasswordConfirmation('');
      setPasswordError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      const userRoles = initialData.roles?.map(r => typeof r === 'string' ? r : r.name) || [];
      setSelectedRoles(userRoles);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setPasswordError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSelectedRoles([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time password validation helper
  const isLengthValid = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_]/.test(password);
  const isMatch = password === passwordConfirmation;

  const handleToggleRole = (roleName) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (!initialData || password) {
      if (!isLengthValid || !hasMixedCase || !hasNumber || !hasSymbol) {
        setPasswordError('ពាក្យសម្ងាត់មិនទាន់ស្មុគស្មាញគ្រប់គ្រាន់តាមលក្ខខណ្ឌកំណត់ឡើយ');
        return;
      }
      if (password !== passwordConfirmation) {
        setPasswordError('ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នាឡើយ');
        return;
      }
    }

    setPasswordError('');

    const payload = {
      name: name.trim(),
      email: email.trim(),
      roles: selectedRoles,
    };

    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'កែប្រែអ្នកប្រើប្រាស់' : 'បង្កើតអ្នកប្រើប្រាស់ថ្មី'}
              </h3>
              <p className="text-xs text-slate-400">កំណត់ព័ត៌មានគណនី និង Roles ក្នុងប្រព័ន្ធ</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {passwordError && (
            <div className="flex items-center gap-2 p-3 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              ឈ្មោះ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ឈ្មោះពេញ..."
              required
              className="w-full px-4 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-slate-300">
              អុីមែល <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-3">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-300">
                ពាក្យសម្ងាត់ {initialData ? '(ទុកទទេបើមិនចង់ផ្លាស់ប្តូរ)' : <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required={!initialData}
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-300">
                បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) {(!initialData || password) && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  required={!initialData || Boolean(password)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Password Requirement Rules Badge Indicators */}
            {(password || !initialData) && (
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl space-y-1.5 text-[11px]">
                <p className="font-semibold text-slate-400 mb-1">លក្ខខណ្ឌពាក្យសម្ងាត់៖</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={12} strokeWidth={isLengthValid ? 3 : 1.5} />
                    <span>យ៉ាងហោច 8 ខ្ទង់</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasMixedCase ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={12} strokeWidth={hasMixedCase ? 3 : 1.5} />
                    <span>អក្សរធំ និងអក្សរតូច</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={12} strokeWidth={hasNumber ? 3 : 1.5} />
                    <span>យ៉ាងហោចលេខ 1 ខ្ទង់</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <Check size={12} strokeWidth={hasSymbol ? 3 : 1.5} />
                    <span>និមិត្តសញ្ញាពិសេស (@!#...)</span>
                  </div>
                </div>
                {passwordConfirmation && (
                  <div className={`flex items-center gap-1.5 pt-1 border-t border-slate-800/60 ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <Check size={12} strokeWidth={isMatch ? 3 : 1.5} />
                    <span>{isMatch ? 'ពាក្យសម្ងាត់ទាំងពីរត្រូវគ្នា' : 'ពាក្យសម្ងាត់ទាំងពីរមិនទាន់ត្រូវគ្នា'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Assign Roles */}
          <div>
            <label className="block mb-2 text-xs font-semibold text-slate-300">
              ជ្រើសរើស Roles
            </label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-950/40 border border-slate-800 rounded-2xl custom-scrollbar">
              {availableRoles.map((role) => {
                const roleName = typeof role === 'string' ? role : role.name;
                const isSelected = selectedRoles.includes(roleName);
                return (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => handleToggleRole(roleName)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ShieldCheck size={14} className={isSelected ? 'text-indigo-400' : 'text-slate-600'} />
                    <span>{roleName}</span>
                    {isSelected && <Check size={12} strokeWidth={3} className="text-indigo-400" />}
                  </button>
                );
              })}
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
              disabled={loading || !name.trim() || !email.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{initialData ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតអ្នកប្រើប្រាស់'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;