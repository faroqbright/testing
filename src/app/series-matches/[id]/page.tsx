import { BASE_URL } from "@/api/config";
import { SeriesGetMatchesListAPI } from "@/api/methods/auth";
import ServerError from "@/ui/components/Error/ServerError";
import Img from "@/ui/components/Img/Img";
import Link from "next/link";
import React from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: React.FC<pageProps> = async ({ params, ...props }) => {
  const response = await SeriesGetMatchesListAPI(params.id);

  try {
    return (
      <div className="md:container bg-white mt-3 py-2">
        {response.data?.matchDetails?.map((matchDetail: any) => {
          return (
            <div key={matchDetail?.matchDetailsMap?.seriesId} className="bg-white w-full">
              <div className="bg-mainBgLight px-3 py-2 w-full line-clamp-1 text-center font-semibold text-gray-400">
                {matchDetail?.matchDetailsMap?.key}
              </div>
              <div className="px-2 py-2 md:px-3 ">
                {matchDetail?.matchDetailsMap.match?.map((match: any) => {
                  return <SeriesMatchesMatchCard key={match?.matchId} match={match} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    return <ServerError />;
  }
};
export default page;

interface SeriesMatchesMatchCardProps {
  match: any;
}

const SeriesMatchesMatchCard: React.FC<SeriesMatchesMatchCardProps> = ({ match }) => {
  return (
    <Link href={`/match/${match?.matchInfo?.matchId}`} className="py-2">
      <div className="flex place-items-center justify-between">
        <div>
          <p className="font-semibold">{match?.matchInfo?.matchDesc}</p>
          <p className="text-xs text-gray-400">{match?.matchInfo?.seriesName}</p>
        </div>
        <div
          className={`${
            match?.matchInfo?.state?.toLowerCase() == "upcoming"
              ? "bg-mainGreen text-white"
              : match?.state?.toLowerCase() == "complete"
              ? "bg-sky-600 text-white"
              : "bg-red-700 text-white"
          } px-2 py-1 rounded-full text-xs md:text-sm line-clamp-1 text-nowrap`}
        >
          {match?.matchInfo?.state}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SeriesMatchesTeamCard team={match?.matchInfo?.team1} matchScore={match?.matchScore?.team1Score} />
        <SeriesMatchesTeamCard team={match?.matchInfo?.team2} matchScore={match?.matchScore?.team2Score} />
        <div className="flex justify-between place-items-center flex-col md:flex-row gap-2">
          <div className="flex place-items-center">
            <Img src={"/assets/imgs/icons/location.svg"} height={20} width={20} alt="" />
            <span className="text-xs md:text-sm text-gray-700 line-clamp-1">
              {match?.matchInfo?.venueInfo?.ground}, {match?.matchInfo?.venueInfo?.city}
            </span>
          </div>
          <div className="flex place-items-center gap-2">
            <Img src={"/assets/imgs/icons/globe.svg"} height={20} width={20} alt="" />
            <span className="text-xs md:text-sm text-gray-700 line-clamp-1">{match?.matchInfo?.status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface SeriesMatchesTeamCardProps {
  team: any;
  matchScore: any;
}

const SeriesMatchesTeamCard: React.FC<SeriesMatchesTeamCardProps> = ({ team, matchScore }) => {
  return (
    <div className="flex place-items-center justify-between">
      <div className="flex place-items-center gap-3 h-full w-full">
        <Img
          src={`${BASE_URL}/cricbuzz/get-image/${team?.imageId}?p=det&d=high`}
          alt={team?.teamName}
          height={35}
          width={40}
          className="rounded-md border-[1px] object-cover"
        />
        <p>{team?.teamSName}</p>
      </div>
      <div className="text-nowrap font-semibold">{matchScore?.score || "0/0 (0)"}</div>
    </div>
  );
};
