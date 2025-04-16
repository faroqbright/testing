"use client";
import React, { useState, useEffect } from "react";
import { HomeAPI } from "@/api/methods/auth.js";
import { getMatchDetailsAPI } from "@/api/methods/auth";
import ServerError from "@/ui/components/Error/ServerError";
import Img from "@/ui/components/Img/Img";
import MatchDetails from "@/ui/components/MatchDetails/MatchDetails";
import Loading from "@/app/loading";
import { BASE_URL } from "@/api/config";
import { convertToLocalDate } from "@/utils/converttimeonly";
import useSocket from "@/utils/socket";

interface ScoreData {
  runs: number;
  wickets: number;
  overs: number;
}

interface Scores {
  team1: ScoreData;
  team2: ScoreData;
  team3: ScoreData;
  team4: ScoreData;
}

const Page: React.FC<{ params: any }> = ({ ...props }) => {
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [error, setError] = useState(false);
  const [decimalId, setDecimalId] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const { socket, emitEvent, onEvent } = useSocket("match-updates");
  const [scores, setScores] = useState<Scores>({
    team1: { runs: 0, wickets: 0, overs: 0 },
    team2: { runs: 0, wickets: 0, overs: 0 },
    team3: { runs: 0, wickets: 0, overs: 0 },
    team4: { runs: 0, wickets: 0, overs: 0 },
  });

  const isLiveMatch = !!decimalId;

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("decimalid");
    setDecimalId(id);
  }, []);

  useEffect(() => {
    console.log("Decimal ID:", decimalId);
  }, [decimalId]);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const data = await HomeAPI();
        setHomeData(data);
      } catch (err) {
        console.error("Error fetching home page data:", err);
        setError(true);
      }
    };

    fetchDatas();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMatchDetailsAPI(props.params.id);
        setMatchDetails(data);
      } catch (err) {
        console.error("Error fetching match details", err);
        setError(true);
      }
    };

    fetchData();
  }, [props.params.id]);

  useEffect(() => {
    if (!socket || !isLiveMatch) return;

    const handleMatchUpdate = (data: any) => {
      if (!data) return;

      setScores({
        team1: {
          runs: data?.scoreboard?.innings1runs || 0,
          wickets: data?.scoreboard?.innings1wickets || 0,
          overs: parseFloat(data?.scoreboard?.innings1overs) || 0,
        },
        team2: {
          runs: data?.scoreboard?.innings2runs || 0,
          wickets: data?.scoreboard?.innings2wickets || 0,
          overs: parseFloat(data?.scoreboard?.innings2overs) || 0,
        },
        team3: {
          runs: data?.scoreboard?.innings3runs || 0,
          wickets: data?.scoreboard?.innings3wickets || 0,
          overs: parseFloat(data?.scoreboard?.innings3overs) || 0,
        },
        team4: {
          runs: data?.scoreboard?.innings4runs || 0,
          wickets: data?.scoreboard?.innings4wickets || 0,
          overs: parseFloat(data?.scoreboard?.innings4overs) || 0,
        },
      });
    };

    emitEvent("subscribeMatch", {
      matchId: decimalId,
      types: ["scoreboard"],
    });

    const cleanup = onEvent("matchUpdate", handleMatchUpdate);

    return () => {
      cleanup();
      if (socket.connected) {
        emitEvent("unsubscribeMatch", { matchId: decimalId });
      }
    };
  }, [socket, decimalId, isLiveMatch, emitEvent, onEvent]);

  const getScoreDisplay = (innings: number): string => {
    if (!isLiveMatch) {
      return innings === 1
        ? matchDetails?.data?.matchInfo?.team1?.score?.score || ""
        : innings === 2
        ? matchDetails?.data?.matchInfo?.team2?.score?.score || ""
        : "";
    }

    const scoreData =
      innings === 1 ? scores.team1 : innings === 2 ? scores.team2 : innings === 3 ? scores.team3 : scores.team4;

    if (scoreData.runs === 0 && scoreData.wickets === 0 && scoreData.overs === 0) {
      return "";
    }

    return `${scoreData.runs}/${scoreData.wickets} (${scoreData.overs})`;
  };

  if (error) {
    return <ServerError />;
  }

  if (!matchDetails) {
    return <Loading />;
  }

  if (matchDetails.status === 200) {
    return (
      <div className="bg-mainBgLight w-full flex flex-col place-items-center min-h-screen h-fit relative">
        <span className="bg-mainGreen absolute top-0 w-full h-[150px] rounded-b-[50px] md:hidden"></span>

        {isLiveMatch && (
          <div className="absolute top-5 right-4 md:right-[13%] xl:right-[23%] z-50 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            LIVE
          </div>
        )}

        <div className="relative md:w-[80%] xl:w-[60%] w-[90%] md:h-[400px] h-56 rounded-xl m-2 bg-matchCardBg bg-cover">
          <p className="z-20 absolute top-3 w-full text-center text-white">
            {matchDetails.data.matchInfo?.complete
              ? "Match Completed"
              : `${matchDetails?.data?.matchInfo?.date}, ${convertToLocalDate(matchDetails?.data?.matchInfo?.time)} ${
                  matchDetails?.data?.matchInfo?.series?.name
                }`}
          </p>
          <span className="bg-gradient-to-b from-[#2121218c] to-transparent h-full w-full absolute z-10 rounded-xl"></span>
          <div className="absolute flex justify-center place-items-center z-50 h-full w-full flex-col">
            <div className="w-full flex justify-evenly">
              <div className="flex flex-col gap-1 text-white justify-center place-items-center">
                <Img
                  src={`${BASE_URL}/cricbuzz/team-flag/${matchDetails.data.matchInfo?.team1?.id}?p=det&d=high`}
                  width={80}
                  height={75}
                  alt={matchDetails.data.matchInfo?.team1.name}
                />
                <p className="text-white">{matchDetails.data.matchInfo?.team1.name}</p>
                {isLiveMatch && <p className="text-white mt-2 font-bold">{getScoreDisplay(1) || "Yet to bat"}</p>}
                {!isLiveMatch && matchDetails.data.matchInfo?.team1?.score?.score && (
                  <p className="text-white font-bold">{matchDetails.data.matchInfo?.team1?.score?.score}</p>
                )}
              </div>
              <h1 className="text-white font-bold text-3xl mt-1 font-mono">VS</h1>
              <div className="flex flex-col gap-1 text-white justify-center place-items-center">
                <Img
                  src={`${BASE_URL}/cricbuzz/team-flag/${matchDetails.data.matchInfo?.team2?.id}?p=det&d=high`}
                  width={80}
                  height={75}
                  alt={matchDetails.data.matchInfo?.team2.name}
                />
                <p className="text-white">{matchDetails.data.matchInfo?.team2.name}</p>
                {isLiveMatch && <p className="text-white mt-2 font-bold">{getScoreDisplay(2) || "Yet to bat"}</p>}
                {!isLiveMatch && matchDetails.data.matchInfo?.team2?.score?.score && (
                  <p className="text-white font-bold">{matchDetails.data.matchInfo?.team2?.score?.score}</p>
                )}
              </div>
            </div>
            <p className="absolute bottom-3 text-white flex place-items-center">
              <span className="font-bold">
                <Img src={"/assets/imgs/icons/location.svg"} height={20} width={20} alt="" />
              </span>
              <span>{matchDetails.data.venueInfo?.ground}</span>
            </p>
          </div>
        </div>
        <MatchDetails matchDetails={matchDetails.data} />
      </div>
    );
  } else {
    return <ServerError />;
  }
};

export default Page;
