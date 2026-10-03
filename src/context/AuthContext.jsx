import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import AuthContext from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateAuthState = useCallback((responseData) => {
    const payload = responseData?.data ?? responseData;
    const currentUser =
      payload?.user ??
      payload?.data?.user ??
      (payload?.success ? payload.data : payload);

    if (
      !currentUser ||
      typeof currentUser !== "object" ||
      currentUser.success === false
    ) {
      setUser(null);
      setRoles([]);
      setPermissions([]);
      return null;
    }

    const roleValues =
      payload.roles ?? currentUser.roles ?? currentUser.role ?? [];
    const permissionValues =
      payload?.permissions ?? currentUser.permissions ?? [];
    setUser(currentUser);
    setRoles(Array.isArray(roleValues) ? roleValues : [roleValues]);
    setPermissions(
      Array.isArray(permissionValues) ? permissionValues : [permissionValues],
    );
    return currentUser;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setRoles([]);
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getDashboardUser();
      return updateAuthState(response);
    } catch (error) {
      console.error("Session verification failed:", error);
      localStorage.removeItem("access_token");
      setUser(null);
      setRoles([]);
      setPermissions([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateAuthState]);

  useEffect(() => {
    void Promise.resolve().then(fetchCurrentUser);
  }, [fetchCurrentUser]);

  const loginStateUpdate = useCallback(
    (responseData) => {
      updateAuthState(responseData);
    },
    [updateAuthState],
  );

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      setRoles([]);
      setPermissions([]);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        permissions,
        loading,
        loginStateUpdate,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
