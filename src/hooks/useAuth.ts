import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useHandleModal from "./useHandleModal";
import { refreshToken } from "@/api/config";

export const useAuth = () => {
  const { openModal } = useHandleModal({ modal: "session-expired" });
  const [isLogin, setIsLogin] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5; // Try up to 5 times
    const retryDelay = 500; // 500ms delay between retries

    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      let authRaw = localStorage.getItem("auth");
      while (!authRaw && retryCount < maxRetries) {
        console.log(`🔄 Waiting for auth data... Attempt ${retryCount + 1}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        authRaw = localStorage.getItem("auth");
        retryCount++;
      }

      if (!authRaw) {
        console.log("❌ No auth data found in localStorage after retries.");
        setIsLogin(false);
        return;
      }

      let authData;
      try {
        authData = JSON.parse(authRaw);
      } catch (error) {
        console.error("❌ Failed to parse auth data:", error);
        setIsLogin(false);
        return;
      }

      if (!authData?.jwt) {
        console.log("❌ No valid JWT found, user is logged out");
        setIsLogin(false);
        return;
      }

      console.log("✅ Token found:", authData.jwt);

      let jwt;
      try {
        jwt = jwtDecode(authData.jwt);
      } catch (error) {
        console.error("❌ Failed to decode JWT:", error);
        setIsLogin(false);
        return;
      }

      if (!jwt?.exp) {
        console.log("❌ Invalid JWT structure, missing 'exp' field.");
        setIsLogin(false);
        return;
      }

      const currentDate = Math.floor(Date.now() / 1000);

      if (currentDate > jwt.exp) {
        console.log("🔄 Access token expired, trying to refresh...");
        const newToken = await refreshToken();

        if (newToken) {
          console.log("✅ Token refreshed successfully!");
          setIsLogin(true);
          return;
        }

        console.log("❌ Token refresh failed, logging out...");
        setIsSessionExpired(true);
        setIsLogin(false);
        openModal();
      } else {
        console.log("✅ User is logged in.");
        setIsLogin(true);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [window.location.pathname]);

  return { isLogin, isSessionExpired };
};
