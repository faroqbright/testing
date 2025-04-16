"use server";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

export const getCookiesSSR = (cookieName: string) => {
  if (typeof window === "undefined") {
    // Server-side
    console.log("getting cookies from server side");

    // Use `cookies` from Next.js headers
    return getCookie(cookieName, { cookies });
  }
};
