import api from "./api";

const saveToken = (token, rememberMe = false) => {
  if (!token) return;

  if (rememberMe) {
    localStorage.setItem("access_token", token);
    sessionStorage.removeItem("access_token");
    return;
  }

  sessionStorage.setItem("access_token", token);
  localStorage.removeItem("access_token");
};

export const authService = {
  // Register User
  register: async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  },

  // Login User
  login: async (credentials, rememberMe = false) => {
    const response = await api.post("/login", credentials);
    const token =
      response.data?.token ??
      response.data?.data?.token ??
      response.data?.access_token ??
      response.data?.data?.access_token;
    if (token) {
      saveToken(token, rememberMe);
    }
    return response.data;
  },

  // Get Current Dashboard / User Data (កែប្រែ Endpoint ទៅជា /dashboard-user)
  getDashboardUser: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  // Logout User
  logout: async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (payload) => {
    const response = await api.post("/reset-password", payload);
    return response.data;
  },
};