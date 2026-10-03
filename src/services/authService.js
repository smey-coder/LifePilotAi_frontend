import api from "./api";

export const authService = {
  // Register User
  register: async (userData) => {
    // userData: { name, email, password, password_confirmation }
    const response = await api.post("/register", userData);
    return response.data;
  },

  // Login User
  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    const token =
      response.data?.token ??
      response.data?.data?.token ??
      response.data?.access_token ??
      response.data?.data?.access_token;
    if (token) {
      localStorage.setItem("access_token", token);
    }
    return response.data;
  },

  // Get Current Dashboard / User Data
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
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (payload) => {
    // payload: { token, email, password, password_confirmation }
    const response = await api.post("/reset-password", payload);
    return response.data;
  },
};
