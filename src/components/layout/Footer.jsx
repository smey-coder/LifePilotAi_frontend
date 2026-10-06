import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-800/80 py-4 px-6 text-xs text-slate-500 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors duration-300">
      <div>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-700 dark:text-neutral-200">LifePilot AI</span>. All rights reserved.
      </div>
      <div className="flex items-center gap-4 text-slate-400 dark:text-neutral-500">
        <a href="#privacy" className="hover:text-slate-600 dark:hover:text-neutral-300 transition">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#terms" className="hover:text-slate-600 dark:hover:text-neutral-300 transition">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;