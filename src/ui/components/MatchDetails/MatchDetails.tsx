"use client";
import { MatchData } from "@/@types";
import type { HTMLAttributes } from "react";
import React from "react";
import MatchDetailsTab from "./MatchDetailsTab";
import MatchDetailsSection from "./MatchDetailsComentaryTab";

interface MatchDetailsProps extends HTMLAttributes<HTMLDivElement> {
  matchDetails: MatchData;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ matchDetails, ...props }) => {
  return (
    <div className="md:w-[80%] xl:w-[60%] w-full flex flex-col gap-5" {...props}>
      <MatchDetailsTab matchType={matchDetails.matchInfo?.matchType} />
      <MatchDetailsSection matchDetails={matchDetails} />
    </div>
  );
};
export default MatchDetails;