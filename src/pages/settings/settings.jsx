import React from "react";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import UserSettings from "./UserSettings";
import AdminSettings from "./AdminSettings";

const Setting = () => {
  const { roles = [], loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Loading settings..." />;
  }

  const isAdmin = roles.some(
    (role) => typeof role === "string" && role.toLowerCase() === "admin",
  );

  return isAdmin ? <AdminSettings /> : <UserSettings />;
};

export default Setting;
