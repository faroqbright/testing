import type { HTMLAttributes } from "react";
import React, { Suspense } from "react";
import HomePageRecommended from "./HomePageRecommended";
import HomePageWebTags from "./HomePageWebTags";
import HomePageNews from "./HomePageNews";
import { HomeAPI, NewsAPIForTrendsNew } from "@/api/methods/auth";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";

interface HomePageMainSectionProps extends HTMLAttributes<HTMLDivElement> {}

const HomePageMainSection: React.FC<HomePageMainSectionProps> = async ({ ...props }) => {
  try {
    const fetchHomePage = async () => {
      const data = await HomeAPI();
      console.log("tgisisisi",data);
      
      return data;
    };
    const data = await fetchHomePage();
    const newsData = await NewsAPIForTrendsNew();

    console.log("newsData: ))))))))))))))))))))))))", newsData);
    return (
      <Suspense fallback={<Loading />}>
        <div className="hidden md:grid md:grid-cols-12 gap-3" {...props}>
          <HomePageRecommended recommendedData={newsData.data.recommanded} />
          <HomePageWebTags tagsData={data.data.tags} />
          <HomePageNews />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    
    return <ServerError />;
  }
};
export default HomePageMainSection;
