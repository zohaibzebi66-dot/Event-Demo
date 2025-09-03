import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const eventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  },

  // Get single event by ID
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },

  // Create new event (admin)
  createEvent: async (eventData) => {
    try {
      const response = await api.post("/admin/events", eventData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create event"
      );
    }
  },

  // Update event (admin)
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/admin/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update event"
      );
    }
  },

  // Delete event (admin)
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/admin/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error("API is not available");
    }
  },
};

export default api;
