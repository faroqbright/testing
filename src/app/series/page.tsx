import HomePageNews from "@/ui/components/HomePageMainSection/HomePageNews";
import SeriesPageMainSection from "@/ui/components/SeriesPage/SeriesPageMainSection";
import SeriesPageMainTabs from "@/ui/components/SeriesPage/SeriesPageMainTabs";
import type { HTMLAttributes } from "react";
import React from "react";

const page: React.FC = ({ ...props }) => {
  return (
    <div className="bg-mainBg grid grid-cols-12 gap-3 my-3" {...props}>
      <div className="col-span-12 lg:col-span-6 xl:col-span-6 2xl:col-span-8 gap-3 flex flex-col">
        <SeriesPageMainTabs />
        <SeriesPageMainSection />
      </div>
      <div className="xl:col-span-6 lg:col-span-6  lg:block 2xl:col-span-4 hidden bg-white h-fit">
        <HomePageNews />
      </div>
    </div>
  );
};
export default page;
