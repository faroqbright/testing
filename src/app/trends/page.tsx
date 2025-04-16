// "use client";
// import TrendsPage from "@/ui/components/Trends/TrendsPage";
// import React from "react";
// import useSWR from "swr";
// import Loading from "../loading";
// import ServerError from "@/ui/components/Error/ServerError";
// import { HomeAPI, TrendAPINew } from "@/api/methods/auth";

// const Page: React.FC = ({ ...props }) => {
//   const fetcher = () => TrendAPINew(8);

//   const { data: homePageData, error, isLoading } = useSWR("/posts/all-feed", fetcher);

//   return (
//     <div className="h-full w-full">
//       {isLoading ? (
//         <Loading />
//       ) : error ? (
//         <ServerError />
//       ) : (
//         <TrendsPage bannerData={homePageData?.data?.feed?.data} tagsData={homePageData?.data?.tags} />

//       )}
//     </div>
//   );
// };
// export default Page;
"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../loading";
import ServerError from "@/ui/components/Error/ServerError";
import TrendsPage from "@/ui/components/Trends/TrendsPage";
import { getRequest } from "@/api/index";
import { TrendAPINew } from "@/api/methods/auth";

const Page: React.FC = ({ ...props }) => {
  const fetcher = () => TrendAPINew(1);
  const { data: homePageData, error, isLoading } = useSWR("/posts/all-feed", fetcher);

  const [bannerData, setBannerData] = useState<any[]>([]);
  useEffect(()=>{setBannerData(homePageData?.data.feed.data)},[homePageData?.data.feed.data.length])
  console.log(bannerData,";;;;;;;;;;;;;;;;;;;")
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const handlePagination = () => {
    if (isFetching) return;

    setIsFetching(true);
    const nextPage = currentPage + 1;

    getRequest(`/posts/all-feed?page=${nextPage}`)
      .then((response) => {
        const newBanners = response?.data?.feed.data;

        if (Array.isArray(newBanners)) {
          setBannerData((prevData) => [...prevData, ...newBanners]);
          setCurrentPage(nextPage);
        } else {
          console.error("Unexpected response structure:", response);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  if (isLoading) return <Loading />;
  if (error) return <ServerError />;

  return (
    <div className="h-full w-full">
      <TrendsPage
        bannerData={bannerData}
        tagsData={homePageData?.data?.tags}
        onPaginate={handlePagination}
        isFetching={isFetching}
      />
    </div>
  );
};

export default Page;
