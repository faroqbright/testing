"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/global/store";
import { TagMatch, setCurrentTag } from "@/global/reducers/tagsSlice";
import HomePageSeriesMatches from "./HomePageSeriesMatches";
import { setHomePageSeries } from "@/global/reducers/homePageSeriesSlice";

interface TagsCarousalProps extends HTMLAttributes<HTMLDivElement> {
  seriesData: any[];
}

interface Tag {
  id: number;
  name: string;
  posts: TagMatch[];
}
const HomePageSeriesCarousal: React.FC<TagsCarousalProps> = ({ seriesData, ...props }) => {
  const state = useSelector((state: RootState) => state.homePageSeries);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setHomePageSeries({
        currentSeries: seriesData[0]?.seriesName,
        matches: seriesData[0]?.matches,
      })
    );
  }, [dispatch, seriesData]);

  const [emblaRef] = useEmblaCarousel();

  const handleTagSelection = (series: any) => {
    dispatch(
      setHomePageSeries({
        currentSeries: series?.seriesName,
        matches: series?.matches,
      })
    );
  };
  const currentSeries = state.currentSeries;
  return (
    <div className="flex flex-col">
      <div className="flex place-items-center relative" {...props}>
        <div className="overflow-hidden py-4 md:mx-2 w-full" ref={emblaRef}>
          <div className="flex place-items-center justify-between w-full gap-2">
            {seriesData?.map((series: any, index: number) => {
              return (
                <button
                  onClick={() => handleTagSelection(series)}
                  className={`${
                    currentSeries == series.seriesName
                      ? "text-mainGreen bg-mainGreen bg-opacity-35 rounded-xl px-1 border-[1px] border-mainGreen"
                      : ""
                  } text-nowrap italic`}
                  key={series.id ?? index} // Ensure a unique key
                >
                  <p className={`${currentSeries == series.seriesName ? "" : "text-opacity-50 text-gray-600"}`}>
                    {series.seriesName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <HomePageSeriesMatches />
    </div>
  );
};
export default HomePageSeriesCarousal;
