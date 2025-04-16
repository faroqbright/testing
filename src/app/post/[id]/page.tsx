import { getPost } from "@/api/methods/auth";
import ServerError from "@/ui/components/Error/ServerError";
import Img from "@/ui/components/Img/Img";
import Navigation from "@/ui/components/MainHeader/Navigation";
import RecommendedPosts from "@/ui/components/PostPage/RecommendedPosts";
import { getFirstThreeParagraphsText, parseContent } from "@/utils/ParseContent";
import axios from "axios";
import dayjs from "dayjs";
import { Metadata } from "next";
import React, { useEffect } from "react";
import { arrayBuffer } from "stream/consumers";

interface PageProps {
  params: {
    id: number;
  };
}

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const response = await getPost(params.id);
//   const description = getFirstThreeParagraphsText(response.data);

//   return {
//     openGraph: {
//       url: Array.isArray(response.data?.media) && response.data?.media[0]?.url,
//       title: response.data?.message,
//       publishedTime: response.data?.publishedAt,
//       siteName: "CriCap",
//       type: "article",
//       images: [{ url: Array.isArray(response.data?.media) && response.data?.media[0]?.url }],
//       description,
//     },
//     category: "sports",
//     description,
//     title: response.data?.message,
//     robots: { index: true, follow: true },
//   };
// }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const response = await getPost(params.id);
    const description = getFirstThreeParagraphsText(response.data);

    return {
      openGraph: {
        url: Array.isArray(response.data?.media) && response.data?.media[0]?.url,
        title: response.data?.message || "Default Title",
        publishedTime: response.data?.publishedAt,
        siteName: "CriCap",
        type: "article",
        images: [{ url: Array.isArray(response.data?.media) && response.data?.media[0]?.url }],
        description,
      },
      category: "sports",
      description,
      title: response.data?.message || "Default Title",
      robots: { index: true, follow: true },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Could not generate metadata.",
    };
 
  }
}

// export default async function Page(props: PageProps) {
  
//   try {
//     const response = await getPost(props.params.id);
//     if (!response || !response.data) {
//       return <ServerError />;
//     }
//     const posts = Array.isArray(response.data) ? response.data : [response.data];
//     console.log("response:_________ ", response);
//     console.log('posts:+++++++++++++++ ', posts);

//     return (
//       <div className="container bg-mainBgLight py-5">
//         <div className="2xl:max-w-[70%] mx-auto">
//           {posts.map((post, index) => (
//             <div key={index} className="mb-8">
//               {/* <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.id || "No Title Available"}</h1> */}
//               <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.message || "No Title Available"}</h1>

//               {post.media && post.media[0]?.url && (
//                 <div className="relative aspect-video overflow-hidden">
//                   <Img
//                     src={post.media[0]?.url}
//                     fill
//                     alt="Post Image"
//                     className="object-cover hover:scale-125 transition-all duration-500"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-between items-center py-2">
//                 <span className="font-semibold">{dayjs(post.createdAt).format("dddd, D MMMM YYYY")}</span>
//                 <Navigation invertedIcons={false} hiddenOnSm={false} postTitle={post.message} />
//               </div>
//               {parseContent(post.content)}
//             </div>
//           ))}
//           <RecommendedPosts />
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return <ServerError />;
//   }
// }
export default async function Page(props: PageProps) {
  try {
    const response = await getPost(props.params.id);

    if (!response || !response.data) {
      console.error("Post data is missing.");
      return <ServerError />;
    }

    const posts = Array.isArray(response.data) ? response.data : [response.data];
    console.log("Response:_________", response);
    console.log("Posts:+++++++++++++++", posts);

    return (
      <div className="container bg-mainBgLight py-5">
        <div className="2xl:max-w-[70%] mx-auto">
          {posts.map((post, index) => (
            <div key={index} className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">{post.message || "No Title Available"}</h1>
              {post.media?.[0]?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Img
                    src={post.media[0]?.url}
                    fill
                    alt="Post Image"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">{dayjs(post.createdAt).format("dddd, D MMMM YYYY")}</span>
                <Navigation invertedIcons={false} hiddenOnSm={false} postTitle={post.message} />
              </div>
              {parseContent(post.content)}
            </div>
          ))}
          <RecommendedPosts />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return <ServerError />;
  }
}

