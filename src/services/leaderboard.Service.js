import axios from "axios";

import { leaderboardURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: leaderboardURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const leaderboardService = {
  getContestLeaderboard: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch leaderboard" };
    }
  },

  getUserRank: async (id) => {
    try {
      const response = await api.get(`/${id}/rank`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user rank" };
    }
  },
};

export default leaderboardService;