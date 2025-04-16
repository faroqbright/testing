"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import { useQueryState } from "nuqs";
import { useSearchParams } from "next/navigation";
import { seriesPageMainTabsData } from "./seriesPageMainTabs.data";

interface SeriesPageMainTabsProps extends HTMLAttributes<HTMLDivElement> {}

const SeriesPageMainTabs: React.FC<SeriesPageMainTabsProps> = ({ ...props }) => {
  const [seriesQuery, setSeriesQuery] = useQueryState("series-type");
  const currentSeriesType = useSearchParams().get("series-type");

  return (
    <div className="bg-white px-3 py-2 flex place-items-center gap-3" {...props}>
      {seriesPageMainTabsData.map((tab) => {
        return (
          <button
            key={tab.title}
            className={`uppercase border-mainGreen py-1 font-light md:font-bold flex justify-center place-items-center flex-col text-base ${
              currentSeriesType === tab.query ? "border-b-[3px] text-mainGreen" : ""
            }`}
            onClick={() => setSeriesQuery(tab.query)}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );
};
export default SeriesPageMainTabs;
