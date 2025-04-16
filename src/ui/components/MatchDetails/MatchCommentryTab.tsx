import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useSocket from "@/utils/socket";
import { BASE_URL } from "@/api/config";
import Img from "../Img/Img";

interface CommentaryProps {
  matchId: string | number;
  matchData?: any;
}

interface CommentaryItem {
  commText: string;
}

interface MatchHeader {
  team1?: {
    name: string;
  };
  team2?: {
    name: string;
  };
  matchDescription?: string;
  seriesName?: string;
}

const Commentary: React.FC<CommentaryProps> = ({ matchId, matchData }) => {
  const { socket, emitEvent, onEvent } = useSocket("match-updates");
  console.log("socket", socket);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [commentaryList, setCommentaryList] = useState<CommentaryItem[]>([]);
  const [matchHeader, setMatchHeader] = useState<MatchHeader>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get decimalId from props or URL
  const decimalId =  matchData?.decimalId ||
    new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("decimalid");

  const fetchMatchCommentary = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await axios.get(`${BASE_URL}/mongo/matches/${matchId}/commentaries`);
      if (res.status === 200) {
        // Reverse the commentary list to show latest first
        setCommentaryList((res?.data?.commentaryList || []).reverse());
        setMatchHeader(res?.data?.matchHeader || {});
      }
    } catch (error) {
      console.error("Match Commentary API Error ==> ", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchCommentary();
  }, [matchId]);

  const renderCommentaryItem = (data: CommentaryItem, index: number) => {
    const overMatch = data?.commText.match(/(\d+\.\d+)/);
    const overNumber = overMatch ? overMatch[0] : "";

    let bgColor = "bg-gray-100";
    let displayText = data?.commText;

    if (displayText.includes("FOUR")) {
      bgColor = "bg-blue-100";
      displayText = displayText.replace("FOUR", "4");
    } else if (displayText.includes("SIX")) {
      bgColor = "bg-green-100";
      displayText = displayText.replace("SIX", "6");
    } else if (displayText.includes("OUT")) {
      bgColor = "bg-red-100";
      displayText = displayText.replace("OUT", "W");
    } else if (displayText.includes("dot")) {
      bgColor = "bg-gray-200";
      displayText = displayText.replace("dot", "•");
    }

    return (
      <div key={index} className={`flex flex-row p-3 mb-2 rounded-lg ${bgColor} items-start`}>
        <span className="text-sm font-bold mr-2 min-w-[40px]">{overNumber}</span>
        <p className="text-sm text-gray-800 flex-1">{displayText}</p>
      </div>
    );
  };

  const handleScrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        top: scrollViewRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  console.log(socket);

  
  useEffect(() => {
    if (!socket || !decimalId) return;

    const handleConnect = () => {
      console.log("Socket connected!");
      emitEvent("subscribeMatch", {
        matchId: decimalId,
        types: ["commentary"],
      });
    };

    const handleDisconnect = () => console.log("Socket disconnected!");

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);

    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
    };
  }, [socket, decimalId, emitEvent]);


  useEffect(() => {
    const handleMatchUpdate = (data: any) => {
      console.log("Match Update Data:", data);
      if (!data?.commentary) return;

      let newCommentary;
      const commentaryData = data.commentary;

      // Check all possible innings for commentary
      for (let i = 1; i <= 4; i++) {
        const inningsKey = `inns${i}`;
        if (commentaryData.commentaries?.[inningsKey]?.[0]?.commentary) {
          newCommentary = {
            commText: `${commentaryData.current_over}.${commentaryData.current_over_balls} ${commentaryData.commentaries[inningsKey][0].commentary}`,
          };
          break;
        }
      }

      if (newCommentary) {
        // Add new commentary to the beginning of the array instead of the end
        setCommentaryList((prev) => [newCommentary, ...prev]);
      }
    };

    const cleanup = onEvent("matchUpdate", handleMatchUpdate);

    return () => {
      cleanup();
      if (socket?.connected) {
        emitEvent("unsubscribeMatch", { matchId: decimalId });
      }
    };
  }, [socket, decimalId, emitEvent, onEvent]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center py-12 mb-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading commentary...</p>
      </div>
    );
  }


  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center py-12 mb-10">
        <img src="/assets/imgs/bg/error.png" alt="Error" className="w-1/2 max-w-xs opacity-80" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Failed to load commentary</p>
        <button
          onClick={fetchMatchCommentary}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

 
  if (commentaryList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center py-12 mb-10">
        <img src="/assets/imgs/bg/soon.png" alt="Coming Soon" className="w-1/2 max-w-xs opacity-80" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {decimalId ? "Live commentary will appear here" : "No commentary available yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">

      <div className="p-4">
        <div className="w-full ">
          <h1 className="text-lg font-bold text-gray-900">
            {`${matchHeader?.team1?.name || "Team 1"} vs ${matchHeader?.team2?.name || "Team 2"}, ${
              matchHeader?.matchDescription || "Match"
            } - Commentary`}
          </h1>
        </div>

        {matchHeader?.seriesName && (
          <div className="flex flex-row mb-4">
            <span className="text-sm font-bold text-gray-600">Series: </span>
            <span className="text-sm font-bold text-gray-600 underline ml-1">{matchHeader.seriesName}</span>
          </div>
        )}

        <div ref={scrollViewRef} className="overflow-y-auto max-h-[90vh] bg-white rounded-lg p-2 shadow-sm">
          <div className="space-y-2">{commentaryList.map((item, index) => renderCommentaryItem(item, index))}</div>
        </div>
        <button
          onClick={handleScrollToBottom}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all"
        >
          <Img
            src="/assets/imgs/icons/down-arrow.svg"
            width={20}
            height={20}
            alt="Scroll to bottom"
            className="text-gray-800"
          />
        </button>
      </div>
    </div>
  );
};

export default Commentary;
