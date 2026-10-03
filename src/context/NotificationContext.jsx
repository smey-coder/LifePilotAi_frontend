import { useState } from "react";
import NotificationContext from "./NotificationContextValue";

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  /**
   * Show Toast Notification
   * @param {string} message - Message to display
   * @param {'success' | 'error' | 'info' | 'warning'} type - Notification type
   */
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const removeToast = () => setToast(null);

  // Dynamic styling based on notification type
  const getTypeStyles = (type) => {
    switch (type) {
      case "error":
        return {
          badge: "bg-red-500",
          border: "border-red-100",
        };
      case "warning":
        return {
          badge: "bg-amber-500",
          border: "border-amber-100",
        };
      case "info":
        return {
          badge: "bg-indigo-500",
          border: "border-indigo-100",
        };
      case "success":
      default:
        return {
          badge: "bg-emerald-500",
          border: "border-emerald-100",
        };
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast UI Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 animate-slide-up bg-white border-slate-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${getTypeStyles(toast.type).badge}`}
          />
          <p className="text-slate-800">{toast.message}</p>
          <button
            onClick={removeToast}
            className="ml-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            aria-label="Close Toast"
          >
            ✕
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
