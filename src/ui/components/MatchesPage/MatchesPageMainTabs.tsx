"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import { matchesPageMainTabsData } from "./matchesPageMainTabs.data";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";

interface MatchesPageMainTabsProps extends HTMLAttributes<HTMLDivElement> {}

const MatchesPageMainTabs: React.FC<MatchesPageMainTabsProps> = ({ ...props }) => {
  const currentTab = useSearchParams().get("type");

  const [matchTypeQuery, setMatchTypeQuery] = useQueryState("type");
  const handleTabs = (query: string) => {
    setMatchTypeQuery(query);
  };

  return (
    <div className="flex place-items-center gap-3 p-2" {...props}>
      {matchesPageMainTabsData.map((tab) => {
        return (
          <button
            key={tab.title}
            role={tab.title}
            className={`uppercase border-mainGreen py-1 font-light md:font-bold flex justify-center place-items-center flex-col text-base ${
              currentTab === tab.queryName ? "border-b-[3px] text-mainGreen" : ""
            }`}
            onClick={() => handleTabs(tab.queryName)}
          >
            <span className="text-xs">{tab.title}</span>
          </button>
        );
      })}
    </div>
  );
};
export default MatchesPageMainTabs;
