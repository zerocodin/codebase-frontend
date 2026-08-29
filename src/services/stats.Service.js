import axios from "axios";
import { statsURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: statsURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const statsService = {
  /**
   * Get platform statistics
   * @returns {Promise} - Platform stats
   */
  getPlatformStats: async () => {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch stats" };
    }
  },
};

export default statsService;