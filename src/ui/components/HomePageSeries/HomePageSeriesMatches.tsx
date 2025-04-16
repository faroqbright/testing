import { Match } from "@/@types";
import { RootState } from "@/global/store";
import type { HTMLAttributes } from "react";
import React from "react";
import { useSelector } from "react-redux";
import Img from "../Img/Img";

interface HomePageSeriesMatchesProps extends HTMLAttributes<HTMLDivElement> {}

const HomePageSeriesMatches: React.FC<HomePageSeriesMatchesProps> = ({ ...props }) => {
  const state = useSelector((state: RootState) => state.homePageSeries);
  return (
    <div className="flex flex-col gap-2" {...props}>
      {state.matches?.map((match) => {
        return <HomePageSeriesMatchCard key={match.matchId} match={match} />;
      })}
    </div>
  );
};
export default HomePageSeriesMatches;

interface HomePageSeriesMatchCardProps {
  match: Match;
}

export const HomePageSeriesMatchCard: React.FC<HomePageSeriesMatchCardProps> = ({ match }) => {
  return (
    <div className="w-full h-24 bg-white flex place-items-center justify-between">
      <div className="h-full w-full max-w-[50%] flex place-items-center justify-between p-3">
        <div className="relative max-w-8 min-w-8 h-8">
          <Img
            src={`https://ws.stage.cricap.com${match.team1?.image}?p=det&d=high`}
            fill
            alt={match.team1.teamSName}
            className="rounded-md border-[1px] object-cover"
          />
        </div>
        <div className="flex flex-col justify-between place-items-center px-1">
          <span className="line-clamp-1  text-sm">{match.team1.teamSName}</span>
          <span>vs</span>
          <span className="line-clamp-1  text-sm">{match.team2.teamSName}</span>
        </div>
        <div className="relative max-w-8 min-w-8 h-8">
          <Img
            src={`https://ws.stage.cricap.com${match.team2?.image}?p=det&d=high`}
            fill
            alt={match.team2.teamSName}
            className="rounded-md border-[1px] object-cover"
          />
        </div>
      </div>
      <div className="w-full max-w-[50%] h-full bg-match_bg bg-cover bg-no-repeat bg-center bg-blend-soft-light flex flex-col justify-center place-items-center p-1 text-white">
        <p className="text-xl font-bold line-clamp-1 max-w-[70%]">{match.matchDesc}</p>
        <p className="text-sm text-wrap w-[50%] text-center line-clamp-2">{match.city}</p>
      </div>
    </div>
  );
};
