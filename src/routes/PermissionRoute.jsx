import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PermissionRoute = ({ requiredRole, requiredPermission }) => {
  const { roles = [], permissions = [], loading } = useAuth();

  if (loading) return null;

  // 1. ពិនិត្យមើល Role (Case-insensitive)
  const hasRole = requiredRole
    ? roles.some((role) => role.toLowerCase() === requiredRole.toLowerCase())
    : false;

  // 2. ពិនិត្យមើល Permission (Case-insensitive)
  const hasPermission = requiredPermission
    ? permissions.some((perm) => perm.toLowerCase() === requiredPermission.toLowerCase())
    : false;

  // 3. ប្រសិនបើជា Admin គឺមានសិទ្ធិចូលប្រើប្រាស់គ្រប់ Route ទាំងអស់ដោយស្វ័យប្រវត្តិ
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");

  // អនុញ្ញាតប្រសិនបើជា Admin ឬមាន Role ត្រូវ ឬមាន Permission ត្រូវ
  const hasAccess = isAdmin || hasRole || hasPermission;

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PermissionRoute;