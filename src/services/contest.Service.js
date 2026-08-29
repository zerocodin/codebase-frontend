import axios from "axios";

import { contestURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: contestURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const contestService = {
  getUpcomingContests: async () => {
    try {
      const response = await api.get("/upcoming");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch upcoming contests" }
      );
    }
  },

  getOngoingContests: async () => {
    try {
      const response = await api.get("/ongoing");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch ongoing contests" }
      );
    }
  },

  getCompletedContests: async () => {
    try {
      const response = await api.get("/completed");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch completed contests",
        }
      );
    }
  },

  getContestById: async (id) => {
    try {
      const response = await api.get(`/get-contest/${id}`);

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch contests" };
    }
  },

  deleteContest: async (id) => {
    try {
      const response = await api.delete(`/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete contest" };
    }
  },

  createContest: async (contestData) => {
    try {
      const response = await api.post("/create", contestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create contest" };
    }
  },

  updateContest: async (id, contestData) => {
    try {
      const response = await api.put(`/update/${id}`, contestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update contest" };
    }
  },

  registerForContest: async (id) => {
    try {
      const response = await api.post(`/${id}/register`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to register" };
    }
  },

  unregisterFromContest: async (id) => {
    try {
      const response = await api.delete(`/${id}/unregister`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to unregister" };
    }
  },

  getContestByUserId: async (id) => {
    try {
      const response = await api.get(`/get-contest-user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch contests" };
    }
  },

  getContestStats: async (id) => {
    try {
      const response = await api.get(`/${id}/stats`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch contest stats" }
      );
    }
  },
  
  getContestParticipants: async (id) => {
    try {
      const response = await api.get(`/${id}/participants`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch participants" };
    }
  },
};

export default contestService;