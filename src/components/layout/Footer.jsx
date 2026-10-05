import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-700">LifePilot AI</span>. All rights reserved.
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <a href="#privacy" className="hover:text-slate-600 transition">Privacy Policy</a>
        <span>•</span>
        <a href="#terms" className="hover:text-slate-600 transition">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;