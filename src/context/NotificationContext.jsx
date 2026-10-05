import React, { useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import NotificationContextValue from './NotificationContextValue';

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function សម្រាប់លុប Toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Function សម្រាប់បង្ហាញ Toast
  const showNotification = useCallback((type = 'info', message, title = '') => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, title };

    setToasts((prev) => [...prev, newToast]);

    // បាត់ទៅវិញដោយស្វ័យប្រវត្តិនឹងរយៈពេល 4 វិនាទី
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  // Helpers ងាយស្រួលហៅប្រើ
  const showSuccess = useCallback((msg, title = 'ជោគជ័យ!') => showNotification('success', msg, title), [showNotification]);
  const showError = useCallback((msg, title = 'បរាជ័យ!') => showNotification('error', msg, title), [showNotification]);
  const showInfo = useCallback((msg, title = 'ព័ត៌មាន') => showNotification('info', msg, title), [showNotification]);
  const showWarning = useCallback((msg, title = 'ព្រមាន!') => showNotification('warning', msg, title), [showNotification]);

  return (
    <NotificationContextValue.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </NotificationContextValue.Provider>
  );
};

// Sub-Component UI របស់ Toast
const ToastItem = ({ toast, onClose }) => {
  const { type, message, title } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-900/90 border-rose-500/50 text-rose-100',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-900/90 border-amber-500/50 text-amber-100',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    info: {
      bg: 'bg-indigo-900/90 border-indigo-500/50 text-indigo-100',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slide-in ${currentStyle.bg}`}
    >
      <div className="flex items-start gap-3">
        {currentStyle.icon}
        <div>
          {title && <h4 className="text-sm font-bold tracking-wide mb-0.5">{title}</h4>}
          <p className="text-xs font-medium opacity-90 leading-relaxed">{message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};