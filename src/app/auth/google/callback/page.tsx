"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace("#", "?")).get("access_token");

    if (token) {
      localStorage.setItem("jwt", token);
      Cookies.set("jwt", token);
      router.push("/");
    }
  }, [router]);

  return <p>Logging in...</p>;
};

export default GoogleCallback;
