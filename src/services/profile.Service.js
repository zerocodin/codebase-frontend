import axios from "axios";
import { userURL } from "../api/urlEndPoint";

const api = axios.create({
  baseURL: userURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get("/get-profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  },

  changePassword: async (data) => {
    try {
      const response = await api.put("/change-password", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to change password" };
    }
  },

  deleteAccount: async (data) => {
    try {
      const response = await api.delete("/delete-account", { data });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete account" };
    }
  },

  checkEmail: async (data) => {
    try {
      const response = await api.post("/check-email", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Email verification failed" };
    }
  },

  updateEmail: async (data) => {
    try {
      const response = await api.put("/update-email", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update email" };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put("/profile-update", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },

  //image upload need to calculate image size !> 5Mb

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/get-user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user" };
    }
  },
  
  updateProfileImage: async (formData) => {
    try {
      const response = await api.put("/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update image" };
    }
  },
};

export default profileService;
