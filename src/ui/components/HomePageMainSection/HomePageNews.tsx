import type { HTMLAttributes } from "react";
import React, { Suspense } from "react";
import MainSectionHeading from "./MainSectionHeading";
import { NewsListAPI } from "@/api/methods/auth";
import { getTimeDifference } from "@/utils/getTimeDifferance";
import Img from "../Img/Img";
import Link from "next/link";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";

interface HomePageNewsProps extends HTMLAttributes<HTMLDivElement> {}

const HomePageNews: React.FC<HomePageNewsProps> = async ({ ...props }) => {
  try {
    const newsList = await NewsListAPI();

    return (
      <Suspense fallback={<Loading />}>
        <div
          className="2xl:col-span-3 common_main_section md:row-start-2 2xl:row-start-1 2xl:col-start-10 md:col-span-6"
          {...props}
        >
          <MainSectionHeading title="News" />
          <div className="flex flex-col gap-2">
            {newsList.data?.recommanded
              ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              ?.map((newsItem: any) => {
                return <NewsItemCard key={newsItem.id} newsItem={newsItem} />;
              })}
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    return <ServerError />;
  }
};
export default HomePageNews;

interface NewsItemCardProps {
  newsItem: any;
}

export const NewsItemCard: React.FC<NewsItemCardProps> = ({ newsItem }) => {
  return (
    <Link
      href={`/post/${newsItem?.id}`}
      className="flex place-items-center h-full w-full justify-between border-b border-gray-400 p-2 gap-2 cursor-pointer"
    >
      <div className="relative h-[100px] w-[100px] min-w-[30%] rounded-lg">
        <Img src={newsItem.media[0].url} alt="" fill className="object-cover rounded-lg" />
      </div>
      <div className="flex flex-col justify-center pl-2 gap-1">
        <p className="line-clamp-3">{newsItem.message}</p>
        <span className="text-xs text-gray-500">{getTimeDifference(newsItem.date)}</span>
      </div>
    </Link>
  );
};