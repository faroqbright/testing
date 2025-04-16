import { getToken, getRefreshToken, setToken } from "@/utils/getTokenCookie";
import axios from "axios";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://ws.stage.cricap.com/api"
    : "https://ws.cricap.com/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensures cookies are sent along with requests
});

// 🔹 Attach Authorization token from cookies
client.interceptors.request.use((config) => {
  const token = getToken(); // Get token from cookies
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Function to handle token refresh
const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken(); // Get refresh token from localStorage

    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    const response = await axios.post(`${BASE_URL}/auth/token/refresh`, { refreshToken }, { withCredentials: true });

    if (response?.data?.jwt && response?.data?.refreshToken) {
      // Get the current auth data
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");

      // Update tokens in localStorage
      const updatedAuthData = {
        ...authData,
        jwt: response.data.jwt,
        refreshToken: response.data.refreshToken,
      };

      localStorage.setItem("auth", JSON.stringify(updatedAuthData));

      return response.data.jwt;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error);
    return null;
  }
};

// 🔹 Handle token refresh on 401/403 errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (!newAccessToken) return Promise.reject(error);

      client.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return client(originalRequest); // Retry the failed request with new token
    }

    return Promise.reject(error);
  }
);

export { BASE_URL, client };
