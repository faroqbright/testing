"use client"
import React from "react";
import Loading from "@/app/loading";
import { formatBatsmanName } from "@/utils/format";
import useSocket from "@/utils/socket";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface MatchScoreCardProps {
  // matchScoreData: any;
  matchData: {
    state: string;
    scoreCard?: any;
  };
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ matchData }) => {
  const searchParams = useSearchParams();
  const currentInning = searchParams.get("inning");
  const [scoreData, setScoreData] = useState(matchData);
  const { socket, emitEvent, onEvent } = useSocket("match-updates");
  const [decimalId, setDecimalId] = useState<string | null>(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("decimalid");
    setDecimalId(id);
  }, []);

  useEffect(() => {
    console.log("Decimal ID:", decimalId);
  }, [decimalId]);

  console.log("Current inning:", currentInning);
  console.log("Score data:", scoreData);

  const mapSocketBatsmenData = (socketBatsmen: any) => {
    const batsmenData: Record<string, any> = {};
    socketBatsmen?.forEach((batsman: any, index: number) => {
      if (batsman.id !== "0") {
        batsmenData[`bat_${index + 1}`] = {
          batName: batsman.name,
          runs: batsman?.runs || 0,
          balls: batsman?.balls || 0,
          fours: batsman?.fours || 0,
          sixes: batsman?.sixes || 0,
          strikeRate: ((batsman?.runs / batsman?.balls) * 100 || 0).toFixed(2),
          outDesc: batsman?.status || "Not Out",
          dismissal: batsman.dismissal || null,
        };
      }
    });
    return batsmenData;
  };

  const mapSocketBowlersData = (socketBowlers: any) => {
    const bowlersData: Record<string, any> = {};
    socketBowlers?.forEach((bowler: any, index: number) => {
      if (bowler.id !== "0" && bowler.overs > 0) {
        bowlersData[`bowl_${index + 1}`] = {
          bowlName: bowler.name,
          overs: bowler.overs || 0,
          maidens: bowler.maidens || 0,
          runs: bowler.runs || 0,
          wickets: bowler.wickets || 0,
          no_balls: bowler.nb || 0,
          wides: bowler.wd || 0,
          economy: (bowler.runs / bowler.overs || 0).toFixed(2),
        };
      }
    });
    return bowlersData;
  };

  useEffect(() => {
    if (!decimalId) return;

    emitEvent("subscribeMatch", {
      matchId: decimalId,
      types: ["scorecard"],
    });

    const handleMatchUpdate = (data: any) => {
      if (data?.scorecard) {
        setScoreData((prevScoreData: any) => {
          if (!prevScoreData?.scoreCard) return prevScoreData;

          const updatedScoreCard = prevScoreData.scoreCard.map((inning: any, index: number) => {
            if (index === 0 && data.scorecard.inns1) {
              return {
                ...inning,
                batTeamDetails: {
                  ...inning.batTeamDetails,
                  batsmenData: mapSocketBatsmenData(data.scorecard.inns1.batting),
                },
                bowlTeamDetails: {
                  ...inning.bowlTeamDetails,
                  bowlersData: mapSocketBowlersData(data.scorecard.inns1.bowling),
                },
                scoreDetails: {
                  ...inning.scoreDetails,
                  runs: data.scorecard.inns1.runs,
                  wickets: data.scorecard.inns1.wkts,
                  overs: data.scorecard.inns1.overs,
                },
              };
            } else if (index === 1 && data.scorecard.inns2) {
              return {
                ...inning,
                batTeamDetails: {
                  ...inning.batTeamDetails,
                  batsmenData: mapSocketBatsmenData(data.scorecard.inns2.batting),
                },
                bowlTeamDetails: {
                  ...inning.bowlTeamDetails,
                  bowlersData: mapSocketBowlersData(data.scorecard.inns2.bowling),
                },
                scoreDetails: {
                  ...inning.scoreDetails,
                  runs: data.scorecard.inns2.runs,
                  wickets: data.scorecard.inns2.wkts,
                  overs: data.scorecard.inns2.overs,
                },
              };
            }
            return inning;
          });

          return {
            ...prevScoreData,
            scoreCard: updatedScoreCard,
          };
        });
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

  if (!currentInning) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Select an inning to view scorecard</p>
      </div>
    );
  }

  if (!scoreData?.scoreCard?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Scorecard data not available</p>
      </div>
    );
  }

  switch (currentInning) {
    case "first_inning":
      return <ScoreInning battingInnings={scoreData.scoreCard[0]} bowlingInnings={scoreData.scoreCard[0]} />;
    case "second_inning":
      return <ScoreInning battingInnings={scoreData.scoreCard[1]} bowlingInnings={scoreData.scoreCard[1]} />;
    default:
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Invalid inning selected</p>
        </div>
      );
  }
};

interface ScoreInningProps {
  battingInnings: any;
  bowlingInnings: any;
}

export const ScoreInning: React.FC<ScoreInningProps> = ({ battingInnings, bowlingInnings }) => {
  if (!battingInnings || !bowlingInnings) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Inning data not available</p>
      </div>
    );
  }

  const battingData = battingInnings?.batTeamDetails?.batsmenData || {};
  const bowlingData = bowlingInnings?.bowlTeamDetails?.bowlersData || {};

  return (
    <Suspense fallback={<Loading />}>
      <div className="my-3 px-2">
        <div className="flex flex-col w-full h-full rounded-xl overflow-hidden">
          <div className="bg-mainGreen text-white rounded-t-xl p-2 flex place-items-center">
            <Image src={"/assets/imgs/icons/bat.svg"} height={30} width={30} alt="bat" />
            <h3 className="font-bold ml-2">{battingInnings?.innings || 'Batting Innings'}</h3>
            {battingInnings?.scoreDetails && (
              <span className="ml-auto font-semibold">
                {battingInnings.scoreDetails.runs}/{battingInnings.scoreDetails.wickets}(
                {battingInnings.scoreDetails.overs})
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full h-full rounded-b-xl overflow-hidden bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Batter</th>
                  <th className="px-4 py-2">R</th>
                  <th className="px-4 py-2">B</th>
                  <th className="px-4 py-2">4s</th>
                  <th className="px-4 py-2">6s</th>
                  <th className="px-4 py-2">SR</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(battingData).map((key) => {
                  const batsman = battingData[key];
                  if (!batsman) return null;
                  
                  return (
                    <React.Fragment key={key}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-left whitespace-nowrap">
                          {formatBatsmanName(batsman.batName)}
                          {batsman.outDesc === "Not Out" && <span className="text-green-600">*</span>}
                        </td>
                        <td className="px-4 py-2 text-center">{batsman.runs}</td>
                        <td className="px-4 py-2 text-center">{batsman.balls}</td>
                        <td className="px-4 py-2 text-center">{batsman.fours}</td>
                        <td className="px-4 py-2 text-center">{batsman.sixes}</td>
                        <td className="px-4 py-2 text-center">{batsman.strikeRate}</td>
                      </tr>
                      {batsman.outDesc && batsman.outDesc !== "Not Out" && (
                        <tr>
                          <td colSpan={6} className="px-4 py-1 text-right text-sm bg-gray-50 text-gray-600">
                            {batsman.outDesc}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {battingInnings?.batTeamDetails?.extras && (
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-medium">Extras</td>
                    <td className="px-4 py-2 text-center">{battingInnings.batTeamDetails.extras.total || 0}</td>
                    <td colSpan={4} className="px-4 py-2 text-sm text-gray-600">
                      (b {battingInnings.batTeamDetails.extras.b || 0}, lb{" "}
                      {battingInnings.batTeamDetails.extras.lb || 0}, w {battingInnings.batTeamDetails.extras.wd || 0},
                      nb {battingInnings.batTeamDetails.extras.nb || 0})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="px-2 my-5">
        <div className="flex flex-col w-full h-full rounded-xl overflow-hidden">
          <div className="bg-mainGreen text-white rounded-t-xl p-2 flex place-items-center">
            <Image src={"/assets/imgs/icons/bowl.svg"} height={27} width={27} alt="ball" />
            <h3 className="font-bold ml-2">{bowlingInnings?.bowlTeamDetails?.bowlTeamName || 'Bowling Innings'}</h3>
            {bowlingInnings?.scoreDetails && (
              <span className="ml-auto font-semibold">
                {bowlingInnings.scoreDetails.runs}/{bowlingInnings.scoreDetails.wickets}(
                {bowlingInnings.scoreDetails.overs})
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full h-full rounded-b-xl overflow-hidden bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Bowler</th>
                  <th className="px-4 py-2">O</th>
                  <th className="px-4 py-2">M</th>
                  <th className="px-4 py-2">R</th>
                  <th className="px-4 py-2">W</th>
                  <th className="px-4 py-2">ER</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(bowlingData).map((key, index) => {
                  const bowler = bowlingData[key];
                  if (!bowler) return null;
                  
                  return (
                    <tr key={key} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                      <td className="px-4 py-2 text-left whitespace-nowrap">{formatBatsmanName(bowler.bowlName)}</td>
                      <td className="px-4 py-2 text-center">{bowler.overs}</td>
                      <td className="px-4 py-2 text-center">{bowler.maidens}</td>
                      <td className="px-4 py-2 text-center">{bowler.runs}</td>
                      <td className="px-4 py-2 text-center">{bowler.wickets}</td>
                      <td className="px-4 py-2 text-center">{bowler.economy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Suspense>
  );
};