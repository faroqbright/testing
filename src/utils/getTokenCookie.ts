import axios from "axios";

interface AuthData {
  jwt?: string;
  id?: number;
  refreshToken?: string;
  username?: string;
  email?: string;
  provider?: string;
  confirmed?: boolean;
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("auth");
  if (authData) {
    try {
      const parsedData: AuthData = JSON.parse(authData);
      return parsedData.jwt || null;
    } catch (error) {
      console.error("Error parsing auth token:", error);
      return null;
    }
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const authData = localStorage.getItem("auth");
  if (authData) {
    try {
      const parsedData: AuthData = JSON.parse(authData);
      return parsedData.refreshToken || null;
    } catch (error) {
      console.error("Error parsing refresh token:", error);
      return null;
    }
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    const authData = localStorage.getItem("auth");
    let updatedAuth: AuthData = {};

    if (authData) {
      try {
        updatedAuth = JSON.parse(authData) as AuthData;
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }

    updatedAuth.jwt = token;
    localStorage.setItem("auth", JSON.stringify(updatedAuth));
  }
};

const apiClient = axios.create({
  baseURL: process.env.BASE_URL || "https://ws.stage.cricap.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
