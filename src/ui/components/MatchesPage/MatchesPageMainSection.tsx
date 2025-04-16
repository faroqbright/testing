"use client";
import { MatchesListAPIForMatches } from "@/api/methods/auth";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import Img from "../Img/Img";
import Link from "next/link";
import NoData from "../Error/NoData";
import useSWR from "swr";
import { convertToLocalTime } from "@/utils/convertTime";
import useSocket from "@/utils/socket";

interface MatchesPageMainSectionProps extends HTMLAttributes<HTMLDivElement> {}

const MatchesPageMainSection: React.FC<MatchesPageMainSectionProps> = ({ ...props }) => {
  const [matchTypeQuery] = useQueryState("type");
  const [matchCategoryQUery, setMatchCategoryQuery] = useQueryState("category");
  const { data: matchesData, error, isLoading } = useSWR(matchTypeQuery, MatchesListAPIForMatches);

  useEffect(() => {
    const firstCategory = matchesData?.data?.[0]?.type?.toLowerCase();
    if (firstCategory) {
      if (!matchCategoryQUery) {
        setMatchCategoryQuery(firstCategory);
      } else if (matchCategoryQUery) {
        const isAvailableInCurrentType = matchesData?.data?.find(
          (match: any) => match.type?.toLowerCase() === matchCategoryQUery?.toLocaleLowerCase()
        );
        if (!isAvailableInCurrentType) {
          setMatchCategoryQuery(firstCategory);
        }
      }
    }
  }, [matchCategoryQUery, matchesData?.data, setMatchCategoryQuery]);

  const currentTimeLineMatches = matchesData?.data?.find(
    (match: any) => match?.type?.toLowerCase() == matchCategoryQUery?.toLocaleLowerCase()
  )?.timeline;

  if (isLoading) {
    return <Loading />;
  } else {
    if (error) {
      return <ServerError />;
    } else {
      return (
        <div>
          <div className="bg-mainGreen p-4 flex place-items-center gap-3">
            {matchesData?.data?.map((matchItem: any) => {
              return (
                <button
                  className={`${
                    matchCategoryQUery === matchItem?.type.toLowerCase()
                      ? "bg-white text-black rounded-full"
                      : "text-white"
                  } py-1 px-2 font-bold `}
                  key={matchItem?.type}
                  onClick={() => setMatchCategoryQuery(matchItem?.type?.toLowerCase())}
                >
                  {matchItem?.type}
                </button>
              );
            })}
          </div>

          {currentTimeLineMatches && currentTimeLineMatches?.length > 0 ? (
            currentTimeLineMatches?.map((matchesData: any) => {
              return <MatchPageMatchCard key={matchesData?.date} matchesData={matchesData} />;
            })
          ) : (
            <NoData />
          )}
        </div>
      );
    }
  }
};

export default MatchesPageMainSection;

interface MatchPageMatchCardProps {
  matchesData: any;
}

interface ScoreData {
  runs: number;
  wickets: number;
  overs: number;
}

interface MatchScores {
  [decimalId: string]: {
    team1: ScoreData;
    team2: ScoreData;
  };
}

export const MatchPageMatchCard: React.FC<MatchPageMatchCardProps> = ({ matchesData }) => {
  const { socket, emitEvent, onEvent } = useSocket("match-updates");
  const [scores, setScores] = useState<MatchScores>({});

  useEffect(() => {
    if (!socket) return;

    const liveMatches = matchesData.matches.filter(
      (match: any) => match.state === "In Progress" || match.state === "Live"
    );

    if (liveMatches.length === 0) return;

    const handleMatchUpdate = (data: any) => {
      if (!data) return;

      setScores((prev) => ({
        ...prev,
        [data.decimalId]: {
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
        },
      }));
    };

    liveMatches.forEach((match: any) => {
      emitEvent("subscribeMatch", {
        matchId: match.decimalId,
        types: ["scoreboard"],
      });
    });

    const cleanup = onEvent("matchUpdate", handleMatchUpdate);

    return () => {
      cleanup();
      liveMatches.forEach((match: any) => {
        emitEvent("unsubscribeMatch", { matchId: match.decimalId });
      });
    };
  }, [socket, matchesData?.matches, emitEvent, onEvent]);

  const getScoreDisplay = (match: any, teamNumber: 1 | 2): string => {
    const isLive = match.state === "In Progress" || match.state === "Live";

    if (!isLive) {
      const scoreData = teamNumber === 1 ? match.team1.score?.inngs1 : match.team2.score?.inngs1;
      if (!scoreData) return "";
      return `${scoreData.runs || 0}/${scoreData.wickets || 0} (${scoreData.overs || 0})`;
    }

    const liveScore = scores[match.decimalId];
    if (!liveScore) return "Yet to bat";

    const teamScore = teamNumber === 1 ? liveScore.team1 : liveScore.team2;
    if (teamScore.runs === 0 && teamScore.wickets === 0 && teamScore.overs === 0) {
      return "Yet to bat";
    }

    return `${teamScore.runs}/${teamScore.wickets} (${teamScore.overs})`;
  };

  return (
    <div>
      <div className="bg-mainBg flex place-items-center justify-center p-3 font-semibold text-sm">
        {matchesData?.date}
      </div>
      {matchesData?.matches?.map((match: any) => {
        const isLive = match.state === "In Progress" || match.state === "Live";

        return (
          <Link
            href={`/match/${match?.matchId}?tab=info`}
            key={match?.matchId}
            className="bg-white p-3 flex flex-col gap-3 border-b border-gray-300 relative"
          >
            {isLive && (
              <div className="absolute top-5 right-4 md:right-[13%] xl:right-[23%] z-50 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                LIVE
              </div>
            )}

            <div className="flex justify-between place-items-center ">
              <div>
                <p className="font-bold">{match?.matchDesc}</p>
                <p className="text-xs line-clamp-1 text-gray-700">{match?.seriesName}</p>
              </div>
              <div
                className={`${
                  match?.state?.toLowerCase() == "upcoming"
                    ? "bg-mainGreen text-white"
                    : match?.state?.toLowerCase() == "complete"
                    ? "bg-sky-600 text-white"
                    : "bg-red-700 text-white"
                } px-2 py-1 rounded-full text-xs md:text-sm line-clamp-1 text-nowrap`}
              >
                {match?.state}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full flex items-center">
                <div className="relative max-w-10 min-w-10 h-8 border rounded-md border-gray-300 overflow-hidden">
                  <Img src={`https://ws.stage.cricap.com${match?.team1?.image}`} fill alt="" className="object-cover" />
                </div>
                <p className="font-bold ml-3 flex-1 text-left">{match?.team1?.teamName}</p>
                <div>
                  <p className="font-bold">{getScoreDisplay(match, 1)}</p>
                </div>
              </div>

              <div className="w-full flex items-center">
                <div className="relative max-w-10 min-w-10 h-8 border rounded-md border-gray-300 overflow-hidden">
                  <Img src={`https://ws.stage.cricap.com${match?.team2?.image}`} fill alt="" className="object-cover" />
                </div>
                <p className="font-bold ml-3 flex-1 text-left">{match?.team2?.teamName}</p>
                <div>
                  <p className="font-bold">{getScoreDisplay(match, 2)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between place-items-center">
              <p className="text-sm text-mainGreen">
                <span className="font-bold">Location: </span>
                {match?.city}
              </p>

              <span className="text-xs text-gray-400">{convertToLocalTime(match?.status)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
