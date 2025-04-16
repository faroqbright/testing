import { getCookie as getNextCookie } from "cookies-next";

export function getCookie(name: string): string | undefined {
  if (typeof window !== "undefined") {
    // Client-side: Use `cookies-next`
    const cookies = getNextCookie(name);
    // console.log("cookies from client side", cookies);

    return cookies;
  } else {
    // Server-side: Use `cookies-next`
    const { getCookie: getServerCookie } = require("cookies-next");
    const cookies = getServerCookie(name);
    // console.log("cookies from server side", cookies);
    return cookies;
  }
  return undefined; // Return undefined if cookie not found
}
