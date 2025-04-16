"use client";
import { RootState } from "@/global/store";
import { useSelector } from "react-redux";
import Img from "../Img/Img";
import Link from "next/link";

interface TrendsPageTagsProps {}

export const TrendsPageTags: React.FC<TrendsPageTagsProps> = () => {
  const state = useSelector((state: RootState) => state.tagsReducer.matches);
  return (
    <div className="gap-2 grid grid-cols-12">
      {state?.map((news: any) => {
        return <TrendsPageNewsBanner key={news?.id} news={news} />;
      })}
    </div>
  );
};

interface TrendsPageNewsBannerProps {
  news: any;
}

export const TrendsPageNewsBanner: React.FC<TrendsPageNewsBannerProps> = ({ news }) => {
  return (
    <Link
      href={`/post/${news.id}`}
      className="flex justify-between gap-1 px-1 bg-white py-1 col-span-12 lg:col-span-6 2xl:col-span-4"
    >
      <div className="relative aspect-video flex-1 ">
        <Img src={news?.media[0].url} fill className="object-cover rounded-xl" alt="banner" />
      </div>
      <div className="flex-1 bg-white flex flex-col gap-1">
        <span className="bg-mainGreen font-semibold w-fit text-white place-self-end px-1">cricket</span>
        <p className="line-clamp-2 font-semibold text-xs md:text-lg">{news?.message}</p>
      </div>
    </Link>
  );
};
