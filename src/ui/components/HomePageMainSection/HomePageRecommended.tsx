import type { HTMLAttributes } from "react";
import React from "react";
import MainSectionHeading from "./MainSectionHeading";
import Img from "../Img/Img";
import Link from "next/link";

interface HomePageRecommendedProps extends HTMLAttributes<HTMLDivElement> {
  recommendedData: any[];
}

const HomePageRecommended: React.FC<HomePageRecommendedProps> = ({ recommendedData, ...props }) => {
  console.log("recommendedData: ", recommendedData);
  return (
    <div
      className="2xl:col-span-3 common_main_section flex flex-col gap-2 md:row-start-2 2xl:row-start-1 md:col-span-6"
      {...props}
    >
      <MainSectionHeading title="Recommended" />
      {recommendedData.map((recommendedItem) => {
        return <HomePageRecommendedCard key={recommendedItem.id} recommendedItem={recommendedItem} />;
      })}
    </div>
  );
};
export default HomePageRecommended;

interface HomePageRecommendedCardProps {
  recommendedItem: any;
}

export const HomePageRecommendedCard: React.FC<HomePageRecommendedCardProps> = ({ recommendedItem }) => {
  return (
    <Link href={`/post/${recommendedItem.id}`} className="w-full h-fit rounded-t-xl">
      <div className="relative rounded-xl w-full min-h-36 overflow-hidden">
        <Img src={recommendedItem.media[0].url} alt="" fill className="object-cover rounded-xl" />
      </div>
      <p className="text-center text-sm mb-1 line-clamp-2">{recommendedItem?.message}</p>
    </Link>
  );
};
