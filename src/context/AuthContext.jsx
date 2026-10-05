import React, { useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import AuthContextValue from "./AuthContextValue";

const normalizeAccessValues = (values) => {
  if (!values) return [];
  const entries = Array.isArray(values) ? values : [values];
  return entries
    .map((value) => (typeof value === "string" ? value : value?.name))
    .filter((value) => typeof value === "string" && value.trim() !== "");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateAuthState = useCallback((responseData) => {
    // 1. ទាញយក Root Payload (អាចជា responseData.data ឬ responseData)
    const rootData = responseData?.data ?? responseData;
    
    // 2. ទាញយក User Object
    const currentUser = rootData?.user ?? rootData?.data?.user;

    if (!currentUser || typeof currentUser !== "object") {
      setUser(null);
      setRoles([]);
      setPermissions([]);
      return null;
    }

    // 3. ទាញយក Roles (ទាញយកពី rootData.roles ដោយផ្ទាល់ -> ទទួលបាន ["Admin"])
    const rawRoles = rootData?.roles ?? currentUser?.roles ?? [];
    const extractedRoles = normalizeAccessValues(rawRoles);

    // 4. ទាញយក Permissions (ទាញយកពី rootData.permissions ដោយផ្ទាល់ -> ទទួលបាន ["dashboard.view", "tasks.view", ...])
    let rawPermissions = rootData?.permissions ?? currentUser?.permissions ?? [];

    // Fallback ប្រសិនបើ permissions ទទេ ត្រូវទាញចេញពី Nested Roles
    if (rawPermissions.length === 0 && Array.isArray(currentUser?.roles)) {
      currentUser.roles.forEach((r) => {
        if (Array.isArray(r.permissions)) {
          rawPermissions = [...rawPermissions, ...r.permissions];
        }
      });
    }

    const extractedPermissions = normalizeAccessValues(rawPermissions);

    // 5. កត់ត្រាចូល React State
    setUser(currentUser);
    setRoles(extractedRoles); // State `roles` នឹងស្មើ ['Admin']
    setPermissions([...new Set(extractedPermissions)]); // State `permissions` នឹងមាន array ពេញលេញ

    return currentUser;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token =
      localStorage.getItem("access_token") ??
      sessionStorage.getItem("access_token");

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
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("access_token");
      }
      setUser(null);
      setRoles([]);
      setPermissions([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateAuthState]);

  useEffect(() => {
    let isMounted = true;
    fetchCurrentUser().finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchCurrentUser]);

  const loginStateUpdate = useCallback(
    (responseData) => {
      updateAuthState(responseData);
    },
    [updateAuthState]
  );

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      setUser(null);
      setRoles([]);
      setPermissions([]);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContextValue.Provider
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
    </AuthContextValue.Provider>
  );
};