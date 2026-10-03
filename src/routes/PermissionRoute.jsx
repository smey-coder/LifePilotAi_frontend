import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PermissionRoute = ({ requiredRole = "admin" }) => {
  const { roles, loading } = useAuth();

  if (loading) return null;

  const hasAccess = roles && roles.includes(requiredRole);

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PermissionRoute;
