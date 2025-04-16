import { getCurrentTimeWithTimezone } from "@/utils/getCurrentTimeWithZone";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Img from "../Img/Img";
import Link from "next/link";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import { BASE_URL } from "@/api/config";

interface AllSeriesMatchesSectionProps extends HTMLAttributes<HTMLDivElement> {
  tabName: string;
}

const fetchSeriesList = async (type: string) => {
  if (!type) return null;
  try {
    const response = await axios.get(`${BASE_URL}/mongo/series/list`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching series list:", error);
    throw error;
  }
};

const AllSeriesMatchesSection: React.FC<AllSeriesMatchesSectionProps> = ({ tabName, ...props }) => {
  const [currentCategory] = useQueryState(tabName);

  const { data, isLoading, error, mutate } = useSWR(
    currentCategory ? `/mongo/series/list?type=${currentCategory}` : null,
    () => (currentCategory ? fetchSeriesList(currentCategory) : null),
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  useEffect(() => {
    if (currentCategory) mutate();
  }, [currentCategory, mutate]);

  console.log("Full API Response:", data);

  const seriesList = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="bg-white h-fit flex flex-col gap-1" {...props}>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ServerError />
      ) : seriesList.length > 0 ? (
        seriesList.map((seriesData: any, index: number) => (
          <SeriesCard key={seriesData?.date || index} seriesData={seriesData} />
        ))
      ) : (
        <p className="text-center py-4">No series available</p>
      )}
    </div>
  );
};

export default AllSeriesMatchesSection;

interface SeriesCardProps {
  seriesData: any;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ seriesData }) => {
  return (
    <div className="w-full min-h-28">
      <p className="bg-mainBgLight w-full px-3 py-2 font-bold text-gray-600">{seriesData?.date || "Unknown Date"}</p>
      {Array.isArray(seriesData?.series) && seriesData.series.length > 0 ? (
        seriesData.series.map((series: any) => (
          <Link
            href={`/series-matches/${series?.id}`}
            key={series?.id || Math.random()}
            className="px-3 py-2 flex flex-col md:flex-row justify-between md:place-items-center shadow-md gap-2"
          >
            <div className="flex flex-col gap-2">
              <p className="font-bold text-base md:text-xl line-clamp-1">{series?.name || "Unnamed Series"}</p>
              <p className="text-gray-600 text-xs md:text-sm line-clamp-1">
                {series?.startDt ? getCurrentTimeWithTimezone(Number(series.startDt) / 1000) : "Unknown Time"}
              </p>
            </div>
            <button className="font-semibold flex place-items-center place-self-end md:place-self-auto">
              <span>view</span>
              <Img src={"/assets/imgs/icons/right.png"} width={20} height={20} alt="arrow" />
            </button>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 px-3 py-2">No series available for this date.</p>
      )}
    </div>
  );
};
