
// // "use client";
// // import React, { useEffect, useState } from "react";
// // import type { HTMLAttributes } from "react";
// // import useEmblaCarousel from "embla-carousel-react";
// // import BannerCard from "./BannerCard";
// // import { getRequest } from "../../../api/index";

// // interface BannerProps extends HTMLAttributes<HTMLDivElement> {
// //   bannerData: any[];
// // }

// // const Banner: React.FC<BannerProps> = ({ bannerData: initialData, ...props }) => {
// //   const [emblaRef, emblaApi] = useEmblaCarousel();
// //   const [bannerData, setBannerData] = useState(initialData);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [isFetching, setIsFetching] = useState(false);

// //   useEffect(() => {
// //     if (!emblaApi) return;

// //     const handleScrollEnd = () => {
// //       if (emblaApi.canScrollNext() || isFetching) return;

// //       setIsFetching(true);
// //       const nextPage = currentPage + 1;

// //       getRequest(`/posts/all-feed?page=${nextPage}`)
// //       .then((response) => {
// //         console.log("API Response:", response); 
// //         const newBanners = response?.data?.banners || []; 
// //         if (Array.isArray(newBanners)) {
// //           setBannerData((prevData) => [...prevData, ...newBanners]);
// //           setCurrentPage(nextPage);
          
// //         } else {
// //           console.error("Unexpected response structure:", response);
// //         }
// //       })
// //       .catch((error) => {
// //         console.error("API Error:", error);
// //       })
// //       .finally(() => {
// //         setIsFetching(false);
// //       });
// //     }    

// //     emblaApi.on("select", handleScrollEnd);

// //     return () => {
// //       emblaApi.off("select", handleScrollEnd);
// //     };
// //   }, [emblaApi, currentPage, isFetching]);

// //   return (
// //     <div className="flex flex-col">
// //       <div className="flex place-items-center relative" {...props}>
// //         <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
// //           <div className="flex place-items-center gap-2">
// //             {bannerData?.map((banner: any) => (
// //               <BannerCard key={banner.id} banner={banner} />
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Banner;
// "use client";
// import React, { useEffect, useState } from "react";
// import type { HTMLAttributes } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import BannerCard from "./BannerCard";
// import { getRequest } from "../../../api/index";

// interface BannerProps extends HTMLAttributes<HTMLDivElement> {
//   bannerData: any[];
// }

// const Banner: React.FC<BannerProps> = ({ bannerData: initialData, ...props }) => {
//   const [emblaRef, emblaApi] = useEmblaCarousel();
//   const [bannerData, setBannerData] = useState(initialData);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     if (!emblaApi) return;

//     const handleScrollEnd = () => {
//       if (emblaApi.canScrollNext() || isFetching) return;

//       setIsFetching(true);
//       const nextPage = currentPage + 1;

//       getRequest(`/posts/all-feed?page=${nextPage}`)
//         .then((response) => {
//           console.log("API Response:", response);
//           const newBanners = response?.data?.banners || [];
//           if (Array.isArray(newBanners) && newBanners.length > 0) {
//             setBannerData((prevData) => [...prevData, ...newBanners]);
//             setCurrentPage(nextPage);
//           } else {
//             console.log("No more banners to load.");
//           }
//         })
//         .catch((error) => {
//           console.error("API Error:", error);
//         })
//         .finally(() => {
//           setIsFetching(false);
//         });
//     };

//     emblaApi.on("select", handleScrollEnd);

//     return () => {
//       emblaApi.off("select", handleScrollEnd);
//     };
//   }, [emblaApi, currentPage, isFetching]);

//   return (
//     <div className="flex flex-col">
//       <div className="flex place-items-center relative" {...props}>
//         <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
//           <div className="flex place-items-center gap-2">
//             {bannerData?.map((banner: any) => (
//               <BannerCard key={banner.id} banner={banner} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
"use client";
import React, { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BannerCard from "./BannerCard";
import { getRequest } from "../../../api/index";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  bannerData: any[];
}

const Banner: React.FC<BannerProps> = ({ bannerData: initialData, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [bannerData, setBannerData] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNextPageData = async (page: number) => {
    setIsFetching(true);
    try {
      const response = await getRequest(`/posts/all-feed?page=${page}`);
      const newBanners = response?.data?.banners || [];
      console.log(newBanners,"new55555555555555555555");
      
      if (Array.isArray(newBanners)) {
        setBannerData((prevData) => [...prevData, ...newBanners.slice(0, 10)]);
        setCurrentPage(page);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    const handleScrollEnd = () => {
      if (emblaApi.canScrollNext() || isFetching) return;

      const nextPage = currentPage + 1;
      fetchNextPageData(nextPage);
    };

    emblaApi.on("select", handleScrollEnd);

    return () => {
      emblaApi.off("select", handleScrollEnd);
    };
  }, [emblaApi, currentPage, isFetching]);

  return (
    <div className="flex flex-col">
      <div className="flex place-items-center relative" {...props}>
        <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
          <div className="flex place-items-center gap-2">
            {Array.isArray(bannerData)&&bannerData?.map((banner: any) => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
