import axios from "axios";

import { submissionURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: submissionURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const submissionService = {
  submitSolution: async (data) => {
    try {
      const response = await api.post("/", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to submit solution" };
    }
  },

  getUserSubmissions: async (params = {}) => {
    try {
      const response = await api.get("/user", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch submissions" };
    }
  },

  getSubmissionById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch submission" };
    }
  },


  getProblemSubmissions: async (problemId, params = {}) => {
    try {
      const response = await api.get(`/problem/${problemId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch submissions" };
    }
  },

  getContestSubmissions: async (contestId) => {
    try {
      const response = await api.get(`/contest/${contestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch submissions" };
    }
  },
};

export default submissionService;
