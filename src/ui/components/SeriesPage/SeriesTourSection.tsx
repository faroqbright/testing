import type { ChangeEvent, HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import SeriesSectionWrapper from "./SeriesSectionWrapper";
import { HomeAPI } from "@/api/methods/auth";
import { useQueryState } from "nuqs";
import Loading from "@/app/loading";
import Img from "../Img/Img";
import { MatchPageMatchCard } from "../MatchesPage/MatchesPageMainSection";
import useSWR from "swr";

interface SeriesTourSectionProps extends HTMLAttributes<HTMLDivElement> {}

const SeriesTourSection: React.FC<SeriesTourSectionProps> = ({ ...props }) => {
  const { data, error, isLoading } = useSWR("home-api", HomeAPI);

  return isLoading ? (
    <Loading />
  ) : (
    <SeriesSectionWrapper>
      <TourSelector toursData={data?.data?.series} />
      <ToursData toursData={data?.data?.series} />
    </SeriesSectionWrapper>
  );
};
export default SeriesTourSection;

interface TourSelectorProps {
  toursData: any;
}

export const TourSelector: React.FC<TourSelectorProps> = ({ toursData }) => {
  const [seriesQuery, setSeriesQuery] = useQueryState("tour");

  useEffect(() => {
    if (!seriesQuery && toursData) {
      setSeriesQuery(toursData[0]?.seriesId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toursData]);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSeriesQuery(e.target.value);
  };

  return (
    <div className="w-full bg-mainBg">
      <select value={seriesQuery || ""} name="tours selector" className="w-full px-3 py-2" onChange={handleSelect}>
        {toursData?.map((tour: any) => {
          return (
            <option key={tour?.seriesId} value={tour?.seriesId}>
              {tour?.seriesName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

interface ToursDataProps {
  toursData: any;
}

export const ToursData: React.FC<ToursDataProps> = ({ toursData }) => {
  const [currentTourQuery] = useQueryState("tour");

  return (
    <div className="flex flex-col gap-3">
      <MatchPageMatchCard matchesData={toursData?.find((tour: any) => tour.seriesId == currentTourQuery)} />
    </div>
  );
};
