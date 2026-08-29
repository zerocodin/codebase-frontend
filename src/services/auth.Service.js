import axios from "axios";
import { authURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: authURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// api.interceptors.request.use(
//   (config) => {
//     // You can add token here if not using cookies
//     // const token = localStorage.getItem('accessToken');
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle 401 Unauthorized globally
//     if (error.response?.status === 401) {
//       // Redirect to login or refresh token
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   },
// );

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  logout: async () => {
    try {
      const response = await api.get("/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.put("/reset-password", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  },

  deleteUnverified: async (email) => {
    try {
      const response = await api.delete("/delete-unverified", {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete account" };
    }
  },
};

export default authService;
