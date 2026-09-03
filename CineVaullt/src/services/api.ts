import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://api.tvmaze.com",
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    // TVMaze is a public API.
    // Do not attach Authorization because it can cause CORS errors.
    if (
      token &&
      !config.baseURL?.includes("api.tvmaze.com")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;