import Heading from "@/ui/atoms/heading/Heading";
import type { HTMLAttributes } from "react";
import React from "react";
import HomePageSeriesCarousal from "./HomaPageSeriesCarousal";

interface HomePageSeriesProps extends HTMLAttributes<HTMLDivElement> {
  seriesData: any[];
}

const HomePageSeries: React.FC<HomePageSeriesProps> = ({ seriesData, ...props }) => {
  return (
    <div className="md:hidden" {...props}>
      <Heading title="Series" />
      <HomePageSeriesCarousal seriesData={seriesData} />
    </div>
  );
};
export default HomePageSeries;
