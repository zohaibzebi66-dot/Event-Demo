import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const hotelApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
hotelApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hotelToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
hotelApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hotelToken");
      localStorage.removeItem("hotelData");
      window.location.href = "/hotel/login";
    }
    return Promise.reject(error);
  }
);

export const hotelService = {
  // Authentication
  signup: async (hotelData) => {
    try {
      const response = await hotelApi.post("/hotels/signup", hotelData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("hotelToken", response.data.data.token);
        localStorage.setItem(
          "hotelData",
          JSON.stringify(response.data.data.hotel)
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to signup");
    }
  },

  login: async (credentials) => {
    try {
      const response = await hotelApi.post("/hotels/login", credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("hotelToken", response.data.data.token);
        localStorage.setItem(
          "hotelData",
          JSON.stringify(response.data.data.hotel)
        );
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to login");
    }
  },

  logout: () => {
    localStorage.removeItem("hotelToken");
    localStorage.removeItem("hotelData");
  },

  getCurrentHotel: () => {
    const hotelData = localStorage.getItem("hotelData");
    return hotelData ? JSON.parse(hotelData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("hotelToken");
  },

  // Services
  addService: async (hotelId, serviceData) => {
    try {
      const response = await hotelApi.post(
        `/hotels/${hotelId}/services`,
        serviceData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add service");
    }
  },

  getServices: async (hotelId) => {
    try {
      const response = await hotelApi.get(`/hotels/${hotelId}/services`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch services"
      );
    }
  },

  // Packages
  createPackage: async (hotelId, packageData) => {
    try {
      const response = await hotelApi.post(
        `/hotels/${hotelId}/packages`,
        packageData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create package"
      );
    }
  },

  getPackages: async (hotelId) => {
    try {
      const response = await hotelApi.get(`/hotels/${hotelId}/packages`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch packages"
      );
    }
  },
};

export default hotelApi;
