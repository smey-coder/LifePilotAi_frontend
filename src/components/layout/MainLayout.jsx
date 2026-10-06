import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import useAuth from "../../hooks/useAuth";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, roles = [], permissions = [] } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* 1. Sidebar (Fixed 256px / w-64 on Desktop) */}
      <Sidebar
        roles={roles}
        permissions={permissions}
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* 2. Content Area - Add lg:pl-64 to clear the fixed sidebar space */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-64 transition-all duration-300">
        {/* Fixed Navbar */}
        <Navbar
          user={user}
          roles={roles}
          permissions={permissions}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Page Content View */}
        <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;