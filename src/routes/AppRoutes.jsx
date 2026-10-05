import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import LandingPage from "../pages/public/LandingPage";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../components/layout/MainLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import GoogleCallback from "../pages/auth/GoogleCallback";

// Core Feature Pages
import Dashboard from "../pages/dashboard/Dashboard";
import PermissionList from "../pages/permissions/PermissionList";
import RoleList from "../pages/roles/RoleList";
import UserList from "../pages/users/UserList";
import TaskList from "../pages/tasks/TaskList";
import NoteList from "../pages/notes/NoteList";
// import ReminderList from "../pages/reminders/ReminderList";
// import GoalList from "../pages/goals/GoalList";
// import HabitList from "../pages/habits/HabitList";
// import Profile from "../pages/profile/Profile";

// AI Module Pages
// import AIAssistant from "../pages/ai/AIAssistant";
// import NoteSummary from "../pages/ai/NoteSummary";
// import StudyPlanner from "../pages/ai/StudyPlanner";

// Admin Pages
// import AdminDashboard from "../pages/admin/AdminDashboard";
// import UserList from "../pages/admin/UserList";

// Error Pages
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page (Public) */}
      <Route path="/" element={<LandingPage />} />

      {/* ========================================== */}
      {/* 1. PUBLIC AUTH ROUTES (Guest Users Only)  */}
      {/* ========================================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Route>

      {/* ========================================== */}
      {/* 2. PROTECTED ROUTES (Inside MainLayout)   */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Core Feature Pages */}
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/permissions" element={<PermissionList />} />
          <Route path="/admin/roles" element={<RoleList />} />

          <Route path="/tasks" element={<TaskList />} />
          <Route path="/notes" element={<NoteList />} />
        
          {/* Productivity Modules */}
          
          {/* <Route path="/notes" element={<NoteList />} />
          <Route path="/reminders" element={<ReminderList />} />
          <Route path="/goals" element={<GoalList />} />
          <Route path="/habits" element={<HabitList />} />  */}

          {/* AI Module Pages */}
          {/* <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/ai/summarize-notes" element={<NoteSummary />} />
          <Route path="/ai/study-planner" element={<StudyPlanner />} /> */}

          {/* Profile Management */}
          {/* <Route path="/profile" element={<Profile />} /> */}

          {/* ========================================== */}
          {/* 3. ADMIN RESTRICTED ROUTES (Admin Role)    */}
          {/* ========================================== */}
          <Route element={<PermissionRoute requiredRole="Admin" />}>
            {/* <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} /> */}
          </Route>

        </Route>
      </Route>

      {/* ========================================== */}
      {/* 4. ERROR & FALLBACK ROUTES                 */}
      {/* ========================================== */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;