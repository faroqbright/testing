"use client";
import Heading from "@/ui/atoms/heading/Heading";
import React from "react";
import { TabsData } from "../Navigation/MakeTabs";
import { useQueryState } from "nuqs";
import CricapQ from "./CricapQ";
import BannerPagination from "../Banner/BannerPagination";
interface TrendsPageProps {
  bannerData: any[];
  tagsData: any[];
  onPaginate: () => void;
  isFetching: boolean;
}
const trendsTabData: TabsData[] = [
  {
    title: "News",
    query: "news",
  },
  { title: "CricapQ", query: "cricapq" },
  
];

const TrendsPage: React.FC<TrendsPageProps>= ({ bannerData, tagsData, onPaginate, isFetching }) => {
  const tabName = "trends-tab";
  const [currentTabName] = useQueryState(tabName);
  return (
    <div className="w-full h-full my-2">
      <TrendsPageNewsTab
        bannerData={bannerData}
        tagsData={tagsData}
        onPaginate={onPaginate}
        isFetching={isFetching}
      />
    </div>
  );
};
export default TrendsPage;

interface TrendsPageNewsTabProps {
  bannerData: any;
  tagsData: any;
}
interface TrendsPageNewsTabProps {
  bannerData: any;
  tagsData: any;
  onPaginate: () => void;
  isFetching: boolean;
}
export const TrendsPageNewsTab: React.FC<TrendsPageNewsTabProps> = ({
  onPaginate,
}) => {
  return (
    <div className="px-2 md:px-3 py-2">
      <Heading title="Recommended" />
      <BannerPagination onPaginate={onPaginate} />
        <CricapQ />
      {/* <div className="h-full flex flex-col gap-2">
        <div className="flex place-items-center bg-white px-2">
          <Img src={"/assets/imgs/icons/hashtag.svg"} alt="hashtag" height={20} width={20} className="mr-2" />
          <HashTagCarousal tagsData={tagsData} />
        </div>

        <TrendsPageTags />
      </div> */}
        </div>
  );
};
