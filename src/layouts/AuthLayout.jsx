import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthLayout = () => {
  const { user, loading } = useAuth();

  // ប្រសិនបើ User បាន Login រួចរាល់ មិនអនុញ្ញាតឲ្យចូលមើល Login/Register ទៀតឡើយ
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
