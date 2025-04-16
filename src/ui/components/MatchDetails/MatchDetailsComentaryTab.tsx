"use client";
import { MatchData } from "@/@types";
import { useSearchParams } from "next/navigation";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import {
  MatchDetailsHighlightTab,
  MatchDetailsInfoTab,
  MatchDetailsLiveTab,
  MatchTeamsSquads,
} from "./MatchDetailsTabs";
import { useQueryState } from "nuqs";
import { MatchDetailsScoreCardTab } from "./MatchDetailsScoreCard";
import { match } from "assert";
import { MatchDetailsOddTab } from "./MatchDetailsOdd";
import MatchCommentryTab from "./MatchCommentryTab";
import Commentary from "./MatchCommentryTab";

interface MatchDetailsSectionProps extends HTMLAttributes<HTMLDivElement> {
  matchDetails: MatchData;
}

const MatchDetailsSection: React.FC<MatchDetailsSectionProps> = ({ matchDetails, ...props }) => {
  const [currentTab, setCurrentTab] = useQueryState("tab");

  useEffect(() => {
    if (!currentTab) {
      setCurrentTab("info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (currentTab) {
    case "info":
      return <MatchDetailsInfoTab matchInfo={matchDetails?.matchInfo} />;

    case "live":
      return <MatchDetailsLiveTab />;

    case "highlight":
      return <MatchDetailsHighlightTab matchId={matchDetails.matchInfo?.matchId} />;

    case "commentary":
      return <Commentary matchId={matchDetails.matchInfo?.matchId}/>;

    case "scorecard":
      return <MatchDetailsScoreCardTab matchId={matchDetails.matchInfo?.matchId} />;

    case "squad":
      return <MatchTeamsSquads matchDetails={matchDetails} />;
    case "odd":
      return <MatchDetailsOddTab matchInfo={matchDetails?.matchInfo} />;

    default:
      break;
  }
};
export default MatchDetailsSection;
