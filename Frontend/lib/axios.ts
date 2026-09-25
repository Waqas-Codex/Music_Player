import axios from "axios";
import { store } from "./store";
import { logout } from "./slices/authSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      // token attach karo
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      // current route
      const currentPath = window.location.pathname;

      // sirf protected routes pe logout karo
      if (
        status === 401 &&
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        // local storage clear
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // cookie clear
        document.cookie =
          "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // redux logout
        store.dispatch(logout());

        // redirect
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;