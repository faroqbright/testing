import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";

interface TeamCardProps extends HTMLAttributes<HTMLDivElement> {
  team: any;
  scoreDisplay?: string;
  isLive?: boolean;
  score?: {
    runs?: number;
    wickets?: number;
    overs?: number;
    score?: string;
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team, scoreDisplay = "", isLive = false, score, ...props }) => {
  const displayScore = () => {
    if (scoreDisplay) {
      return scoreDisplay;
    }
    if (score) {
      console.log(score);
      
      if (isLive) {
        return `${score.runs || 0}/${score.wickets || 0}${score.overs ? ` (${score.overs.toFixed(1)})` : ""}`;
      }
      return score.score || "";
    }
    return isLive ? "Yet to bat" : "";
  };

  const scoreToDisplay = displayScore();

  return (
    <div className="flex flex-col justify-center p-1" {...props}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {team?.image ? (
            <div className="relative w-10 h-7">
              <Img
                src={`https://ws.stage.cricap.com${team.image}?p=det&d=high`}
                alt={team.teamName || team.teamSName}
                fill
                className="rounded-md border-[1px] border-gray-200 object-cover"
                onError={(e) => console.error("[TeamCard] Image load error:", e)}
              />
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
              <span className="text-xs">🏏</span>
            </div>
          )}
          <span className="text-sm font-medium">{team.teamSName}</span>
        </div>

        {scoreToDisplay && (
          <div className="text-right">
            <span className="text-sm font-medium text-gray-700">{scoreToDisplay}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
