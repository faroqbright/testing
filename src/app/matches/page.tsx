"use client";
import HomePageNews from "@/ui/components/HomePageMainSection/HomePageNews";
import MatchesPageMainSection from "@/ui/components/MatchesPage/MatchesPageMainSection";
import MatchesPageMainTabs from "@/ui/components/MatchesPage/MatchesPageMainTabs";
import React from "react";

const page: React.FC = ({ ...props }) => {
  return (
    <div className="grid grid-cols-12 gap-3 my-3" {...props}>
      <div className="col-span-12 md:col-span-8  bg-white">
        <MatchesPageMainTabs />
        <MatchesPageMainSection />
      </div>
      <div className="md:col-span-4 md:block hidden bg-white h-fit">
        <HomePageNews />
      </div>
    </div>
  );
};
export default page;
