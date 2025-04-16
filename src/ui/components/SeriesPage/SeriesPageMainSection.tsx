"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import SeriesTourSection from "./SeriesTourSection";
import SeriesAllSeriesSection from "./SeriesAllSeriesSection";
import SeriesRankingSection from "./SeriesRankingSection";
import { useQueryState } from "nuqs";
import { seriesPageMainTabsData } from "./seriesPageMainTabs.data";

interface SeriesPageMainSectionProps extends HTMLAttributes<HTMLDivElement> {}

const SeriesPageMainSection: React.FC<SeriesPageMainSectionProps> = ({ ...props }) => {
  const [currentSeriesType, setCurrentSeriesType] = useQueryState("series-type");

  useEffect(() => {
    if (!currentSeriesType) {
      setCurrentSeriesType(seriesPageMainTabsData[0].query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  switch (currentSeriesType) {
    case "tour":
      return <SeriesTourSection />;
    case "all-series":
      return <SeriesAllSeriesSection />;
    case "ranking":
      return <SeriesRankingSection />;

    default:
      break;
  }
};
export default SeriesPageMainSection;
