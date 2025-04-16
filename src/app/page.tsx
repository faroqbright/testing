"use client";

import React, { useEffect, useState, Suspense } from "react";
import MatchesCarousal from "@/ui/components/MatchesCarousal/MatchesCarousal";
import { HomeAPI } from "@/api/methods/auth.js";
import Trends from "@/ui/components/Trends/Trends";
import HomePageSeries from "@/ui/components/HomePageSeries/HomePageSeries";
import HomePageMainSection from "@/ui/components/HomePageMainSection/HomePageMainSection";
import ServerError from "@/ui/components/Error/ServerError";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "@/api/config";
// import { io, Socket } from "socket.io-client";

// let socket: Socket;

const sendTokenToBackend = async (idToken: string, accessToken: string) => {
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/google/callback`, {
      params: {
        id_token: idToken,
        access_token: accessToken,
      },
    });

    const { jwt, user } = response.data;

    localStorage.setItem("auth", JSON.stringify({ jwt: jwt, user }));

    Cookies.set("access_token", accessToken, { expires: 7 });
    Cookies.set("jwt", jwt, { expires: 7 });

  } catch (error) {
    console.error("❌ Error sending tokens to backend:", error);
  }
};
const Page: React.FC = (props) => {
  const [homePageData, setHomePageData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  // const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //     // Initialize socket connection
  //     socket = io("https://backend.stage.cricap.com/match-updates");

      
  //     socket.on("connect", () => {
  //       setIsConnected(true);
  //     });
  // }, [])
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idToken = params.get("id_token");
      const accessToken = params.get("access_token");
  
      if (idToken && accessToken) {
        try {
          const decodedIdToken = jwtDecode(idToken);
          sendTokenToBackend(idToken, accessToken);
        } catch (error) {
          console.error("❌ Error decoding ID token:", error);
        }
      } else {
        console.warn("⚠️ No ID token or Access token found in URL.");
      }
      router.push("/");
    }
  }, [router]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await HomeAPI();
        console.log("Home Page Data:", data);
        if (data.status === 200) {
          setHomePageData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ServerError />;
  }

  if (!homePageData || !homePageData.data) {
    return <Loading />;
  }

  return (
    <div className="p-2 md:p-0" {...props}>
      <Suspense>{/* <Banner bannerData={homePageData.data.banners || []} /> */}</Suspense>
      <Suspense fallback={<Loading />}>
        <MatchesCarousal matchesData={homePageData.data.matches} />
      </Suspense>
      <Suspense>
        <Trends tagsData={homePageData.data.tags} />
      </Suspense>
      <Suspense>
        <HomePageSeries seriesData={homePageData.data.series} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <HomePageMainSection />
      </Suspense>
    </div>
  );
};

export default Page;
