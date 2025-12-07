// src/service/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const restaurantAPI = {
  // Get all restaurants
  getAll: async () => {
    const response = await api.get("/restaurants");
    return response.data;
  },

  // Get single restaurant
  getOne: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  // Create restaurant
  create: async (restaurantData) => {
    const response = await api.post("/restaurants", {
      restaurant: restaurantData,
    });
    return response.data;
  },

  // Update restaurant
  update: async (id, restaurantData) => {
    const response = await api.patch(`/restaurants/${id}`, {
      restaurant: restaurantData,
    });
    return response.data;
  },

  // Delete restaurant
  delete: async (id) => {
    await api.delete(`/restaurants/${id}`);
  },

  // Search restaurants
  search: async (params) => {
    const response = await api.get("/restaurants/search", { params });
    return response.data;
  },

  // Get Google Maps API key
  getMapsKey: async () => {
    const response = await api.get("/config/maps_key");
    return response.data.api_key;
  },
};
