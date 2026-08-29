import axios from "axios";
import { problemURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: problemURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const problemService = {
  getAllProblems: async (filters = {}) => {
    try {
      const response = await api.get("/get-problems", { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch problems" };
    }
  },

  getProblemById: async (id) => {
    try {
      const response = await api.get(`/problem/${id}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || { message: "Failed to fetch problem" };
    }
  },

  createProblem: async (problemData) => {
    try {
      const response = await api.post("/create", problemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create problem" };
    }
  },

  deleteProblem: async (id) => {
    try {
      const response = await api.delete(`/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete problem" };
    }
  },

  updateProblem: async (id, problemData) => {
    try {
      const response = await api.put(`/update/${id}`, problemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update problem" };
    }
  },
};

export default problemService;
