import React, { useEffect, useState } from "react";
import Link from "next/link";
import TeamCard from "./TeamCard";
import { convertToLocalTime } from "@/utils/convertTime";
import useSocket from "@/utils/socket";
import { Match } from "@/@types/matches";

interface MatchCardProps {
  match: Match;
}

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

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  console.log(match);

  const { socket, emitEvent, onEvent } = useSocket("match-updates");
  const [scores, setScores] = useState<Scores>({
    team1: { runs: 0, wickets: 0, overs: 0 },
    team2: { runs: 0, wickets: 0, overs: 0 },
    team3: { runs: 0, wickets: 0, overs: 0 },
    team4: { runs: 0, wickets: 0, overs: 0 },
  });

  const isLiveMatch = match.state === "In Progress" || match.state === "Live";

  useEffect(() => {
    if (!socket || !isLiveMatch) return;

    console.log("Socket connection status:", socket.connected ? "Connected" : "Disconnected");

    const handleConnect = () => console.log("Socket connected!");
    const handleDisconnect = () => console.log("Socket disconnected!");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, isLiveMatch]);

  useEffect(() => {
    if (!socket || !isLiveMatch) return;

    const handleMatchUpdate = (data: any) => {
      console.log(data);

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
      matchId: match.decimalId,
      types: ["scoreboard"],
    });

    const cleanup = onEvent("matchUpdate", handleMatchUpdate);

    return () => {
      cleanup();
      if (socket.connected) {
        emitEvent("unsubscribeMatch", { matchId: match?.decimalId });
      }
    };
  }, [socket, match?.decimalId, isLiveMatch, emitEvent, onEvent]);

  const getScoreDisplay = (innings: number): string => {
    if (match.state === "Complete" || match.state === "Abandoned" || match.state === "Stumps") {
      return innings === 1 ? match.team1.score?.score || "" : innings === 2 ? match.team2.score?.score || "" : "";
    }

    const scoreData =
      innings === 1 ? scores.team1 : innings === 2 ? scores.team2 : innings === 3 ? scores.team3 : scores.team4;

    if (scoreData.runs === 0 && scoreData.wickets === 0 && scoreData.overs === 0) {
      return "";
    }

    return `${scoreData.runs}/${scoreData.wickets} (${scoreData.overs})`;
  };

  const getStateColor = () => {
    switch (match.state) {
      case "Complete":
        return "bg-sky-500";
      case "Live":
      case "In Progress":
      case "Toss":
        return "bg-red-700";
      case "Upcoming":
      case "Preview":
        return "bg-green-600";
      case "PostPoned":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const renderStatusInfo = () => {
    if (isLiveMatch) {
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Location: {match.city || "Venue not specified"}</span>
            <span className="text-xs font-bold text-[#B91C1C]">LIVE</span>
          </div>
          <span className="text-xs text-green-600 font-medium">{convertToLocalTime(match.status)}</span>
        </>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-600">Location: {match.city || "Venue not specified"}</span>
        <span className="text-xs text-green-600 font-medium">{convertToLocalTime(match.status)}</span>
      </div>
    );
  };

  return (
    <Link
      href={{
        pathname: `/match/${match.matchId}`,
        query: {
          tab: "info",
          ...(isLiveMatch && { decimalid: match.decimalId }),
        },
      }}
      className="min-h-36 bg-white rounded-xl w-72 md:w-80 flex flex-col p-3 gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col w-full pb-1.5 border-b border-gray-400">
        <div className="flex justify-between items-center">
          <p className="font-bold text-sm line-clamp-1">{match.matchDesc}</p>
          <span className={`text-white text-xs px-2 py-1 rounded-full ${getStateColor()}`}>{match.state}</span>
        </div>
        <p className="text-xs text-gray-900 line-clamp-1 mt-0.5">{match.seriesName}</p>
      </div>

      <TeamCard
        team={match.team1}
        scoreDisplay={getScoreDisplay(1)}
        score={
          isLiveMatch
            ? {
                runs: scores.team1.runs,
                wickets: scores.team1.wickets,
                overs: scores.team1.overs,
              }
            : undefined
        }
        isLive={isLiveMatch}
      />

      <TeamCard
        team={match.team2}
        scoreDisplay={getScoreDisplay(2)}
        score={
          isLiveMatch
            ? {
                runs: scores.team2.runs,
                wickets: scores.team2.wickets,
                overs: scores.team2.overs,
              }
            : undefined
        }
        isLive={isLiveMatch}
      />

      <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">{renderStatusInfo()}</div>

      {match.matchDesc?.includes("Test") && isLiveMatch && (
        <>
          <TeamCard
            team={{ teamSName: "Third Innings", image: match.team1.image }}
            scoreDisplay={getScoreDisplay(3)}
            score={{
              runs: scores.team3.runs,
              wickets: scores.team3.wickets,
              overs: scores.team3.overs,
            }}
            isLive
          />
          <TeamCard
            team={{ teamSName: "Fourth Innings", image: match.team2.image }}
            scoreDisplay={getScoreDisplay(4)}
            score={{
              runs: scores.team4.runs,
              wickets: scores.team4.wickets,
              overs: scores.team4.overs,
            }}
            isLive
          />
        </>
      )}
    </Link>
  );
};

export default MatchCard;
