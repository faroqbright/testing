"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import SeriesSectionWrapper from "./SeriesSectionWrapper";
import MakeTabs from "../Navigation/MakeTabs";
import { allSeriesTabsData } from "./allSeriesTabs.data";
import AllSeriesMatchesSection from "./AllSeriesMatchesSection";

interface SeriesAllSeriesSectionProps extends HTMLAttributes<HTMLDivElement> {}

const SeriesAllSeriesSection: React.FC<SeriesAllSeriesSectionProps> = ({ ...props }) => {
  const tabName = "series-category";

  return (
    <SeriesSectionWrapper>
      <MakeTabs tabsType="secondary" tabName={tabName} tabsData={allSeriesTabsData} />
      <AllSeriesMatchesSection tabName={tabName} />
    </SeriesSectionWrapper>
  );
};
export default SeriesAllSeriesSection;
