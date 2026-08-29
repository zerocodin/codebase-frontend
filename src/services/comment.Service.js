import axios from "axios";
import { commentURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: commentURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const commentService = {
  // Add comment
  addComment: async (challengeId, content) => {
    try {
      const response = await api.post(`/${challengeId}`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add comment" };
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete comment" };
    }
  },

  // Like/Unlike comment
  toggleLikeComment: async (commentId) => {
    try {
      const response = await api.post(`/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to toggle like" };
    }
  },
};

export default commentService;
