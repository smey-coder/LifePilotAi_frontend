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
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* 1. Sidebar Component with RBAC */}
      <Sidebar
        roles={roles}
        permissions={permissions}
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          user={user}
          roles={roles}
          permissions={permissions}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Body (Page Views via React Router) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
