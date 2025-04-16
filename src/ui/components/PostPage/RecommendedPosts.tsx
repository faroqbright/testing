import type { HTMLAttributes } from "react";
import React from "react";
import ServerError from "../Error/ServerError";
import { NewsAPIForTrendsNew } from "@/api/methods/auth";
import Img from "../Img/Img";
import Link from "next/link";

interface RecommendedPostsProps extends HTMLAttributes<HTMLDivElement> {}

const RecommendedPosts: React.FC<RecommendedPostsProps> = async ({ ...props }) => {
  try {
    const response = await NewsAPIForTrendsNew();

    return (
      <div>
        <div className="w-full md:w-[60%] flex place-items-center mx-auto gap-1">
          <div className="bg-black w-full h-[2px]"></div>
          <div className="font-bold text-xl">Recommended</div>
          <div className="bg-black w-full h-[2px]"></div>
        </div>
        <div className="grid grid-cols-12 h-full w-full gap-3 my-2">
          {response?.data?.recommanded?.map((post: any) => {
            return <RecommendedPostsCard key={post?.id} recommendedItem={post} />;
          })}
        </div>
      </div>
    );
  } catch (error) {
    return <ServerError />;
  }
};
export default RecommendedPosts;

interface RecommendedPostsCardProps {
  recommendedItem: any;
}

export const RecommendedPostsCard: React.FC<RecommendedPostsCardProps> = ({ recommendedItem }) => {
  return (
    <Link href={`/post/${recommendedItem?.id}`} className="col-span-12 md:col-span-6 xl:col-span-4 bg-white">
      <div className="relative w-full aspect-video">
        <Img src={recommendedItem?.media[0]?.url} fill alt="" className="object-cover" />
      </div>
      <p className="p-1 font-semibold text-center flex place-items-center justify-center line-clamp-2">
        {recommendedItem?.message}
      </p>
    </Link>
  );
};
