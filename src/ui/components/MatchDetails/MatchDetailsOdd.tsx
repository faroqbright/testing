"use client";
import { MatchInfo } from "@/@types";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import NoData from "../Error/NoData";
import Img from "../Img/Img";
import { getMatchTeamDetailsAPI } from "@/api/methods/auth";
import { BASE_URL } from "@/api/config";

interface MatchDetailsOddTabProps {
  matchInfo: MatchInfo;
}

interface MarketDataState {
  providers: any[];
}

export const MatchDetailsOddTab: React.FC<MatchDetailsOddTabProps> = ({ matchInfo }) => {
  const [marketData, setMarketData] = useState<MarketDataState>({ providers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [team1, setTeam1] = useState<any | null>(null);
  const [team2, setTeam2] = useState<any | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const MatchId = matchInfo?.matchId;
        const url = `${BASE_URL}/mongo/matches/${MatchId}/odds`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Fetched Data:", data);
        setMarketData({ providers: data || [] });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setIsLoading(false);
      }
    };
    fetchMarketData();
  }, [matchInfo?.matchId]);

  useEffect(() => {
    const fetchSquadData = async () => {
      try {
        const team1Data = await getMatchTeamDetailsAPI(matchInfo.matchId, matchInfo.team1.id);
        const team2Data = await getMatchTeamDetailsAPI(matchInfo.matchId, matchInfo.team2.id);

        setTeam1(team1Data.data);
        setTeam2(team2Data.data);
      } catch (err) {
        // setError(true);
      }
    };

    fetchSquadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 px-4 my-6 bg-white rounded-lg shadow-md p-5">
      <div className="bg-green-600 flex justify-between items-center p-4 px-32 rounded-lg text-white">
        <div className="flex items-center gap-2">
          <Img
            src={`${BASE_URL}/cricbuzz/team-flag/${team1?.teamId}?p=det&d=high`}
            width={40}
            height={30}
            alt={team1?.teamId}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold">{team1?.teamName}</h1>
        </div>
        <h1 className="text-white font-bold text-3xl mt-1 font-mono">VS</h1>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{team2?.teamName}</h1>
          <Img
            src={`${BASE_URL}/cricbuzz/team-flag/${team2?.teamId}?p=det&d=high`}
            width={40}
            height={30}
            alt={team2?.teamId}
            className="object-contain"
          />
        </div>
      </div>

      {marketData.providers.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.providers.map((provider) => (
            <ProviderCard key={provider.key} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProviderCardProps {
  provider: any;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const outcomes = provider.markets[0]?.outcomes || [];

  return (
    <div className="bg-gray-50 shadow-md rounded-lg p-3">
      <div className="mb-2 border-b border-gray-200 pb-2">
        <h3 className="text-md font-bold">{provider.title}</h3>
        <p className="text-xs text-gray-500">
          Last Updated: {new Date(provider.last_update).toLocaleDateString()}
        </p>
      </div>

      <div className="mb-2 text-sm font-semibold text-gray-600">H2H</div>

      <div className="flex gap-2">
        {outcomes.map((outcome: any, index: number) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md text-center text-sm font-medium ${
              index === 0 ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            } flex-1`}
          >
            <span>{outcome.name}</span>
            <span className="text-lg font-bold">{outcome.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
