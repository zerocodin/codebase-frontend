import axios from "axios";
import { challengeURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: challengeURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const challengeService = {
  // Get all challenges
  getAllChallenges: async (filters = {}) => {
    try {
      const response = await api.get("/", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch challenges" };
    }
  },

  // Get single challenge
  getChallengeById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch challenge" };
    }
  },

  // Create challenge
  createChallenge: async (data) => {
    try {
      const response = await api.post("/", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create challenge" };
    }
  },

  // Upload note image
  uploadNoteImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload image" };
    }
  },
  
  // Like/Unlike challenge
  toggleLike: async (id) => {
    try {
      const response = await api.post(`/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to toggle like" };
    }
  },

  // Delete challenge
  deleteChallenge: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete challenge" };
    }
  },
};

export default challengeService;
