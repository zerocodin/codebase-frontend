import axios from "axios";
import { userProgressURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: userProgressURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const userProgressService = {
  getUserProgress: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch progress" };
    }
  },

  /**
   * Get user stats
   * @returns {Promise} - User stats
   */
  getUserStats: async () => {
    try {
      const response = await api.get("/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch stats" };
    }
  },

  /**
   * Get public user stats by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Public user stats
   */
  getPublicUserStats: async (userId) => {
    try {
      const response = await api.get(`/public/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user stats" };
    }
  },
};

export default userProgressService;