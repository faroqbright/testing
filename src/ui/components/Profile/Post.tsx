import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import { getOwnPosts } from "@/api/methods/auth";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import { FeedPost } from "@/@types/feed";
import { parseContent } from "@/utils/ParseContent";

interface postsDataState {
  isError: boolean;
  isLoading: boolean;
  data: FeedPost[] | undefined;
}

const Post = () => {
  const [ownPostsData, setOwnPostsData] = useState<postsDataState>({
    isError: false,
    isLoading: true,
    data: undefined,
  });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getOwnPosts();

        // console.log("response for API data ", response.data.feed.data);

        setOwnPostsData((prev) => {
          return { ...prev, data: response?.data?.feed?.data };
        });
      } catch (error) {
        setOwnPostsData((prev) => {
          return { ...prev, isError: true };
        });
      } finally {
        setOwnPostsData((prev) => {
          return { ...prev, isLoading: false };
        });
      }
    };
    fetchPosts();
  }, []);

  if (ownPostsData.isLoading) {
    return <Loading />;
  }

  if (ownPostsData.isError) {
    return <ServerError />;
  }

  return (
    <div>
      {ownPostsData.data?.map((post, index) => {
        return (
          <div key={index} className="flex items-start gap-2 my-4">
            <div className="tab-profile-image">
              <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
            </div>
            <div className="profile-content-wrapper w-[100%]">
              <div className="flex gap-2 items-center">
                <div className="profile-name font-semibold text-[22px] text-black">{post.user.username}</div>
                <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@{post.user.username}</div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-[#464646] text-[18px]">{post.message}</span>
                <p className="text-[#464646] w-[100%] md:w-[50%]">
                  {/* {post.content && post.content?.length > 0 ? parseContent(post.content) : null} */}
                  {post.message}
                </p>
                <div
                  className={`cricq-post-img p-2 ${post.media ? "border-2 border-[#E7E7E7] rounded-[15px]" : "hidden"}`}
                >
                  <Img className="rounded-[15px]" src={post.media} height={250} width={500} alt="soon" />
                </div>
                <div className="flex gap-4 items-center">
                  {/* Likes Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={post.likedByUser ? "/assets/imgs/icons/heart-filled.svg" : "/assets/imgs/icons/heart.svg"} // Change icon based on likedByUser
                      height={20}
                      width={20}
                      alt="Like"
                    />
                    <span>{post.likesCount ?? 0}</span>
                  </div>
                  {/* Comments Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/comment.svg"}
                      height={20}
                      width={20}
                      alt="Comment"
                    />
                    <span>{post.commentsCount ?? null}</span>
                  </div>
                  {/* Repost Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/repeat.svg"}
                      height={20}
                      width={20}
                      alt="Repost"
                    />
                    <span>{post.repost?.likesCount ?? null}</span> {/* Adjust based on your API data structure */}
                  </div>
                  {/* Share Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/share.svg"}
                      height={20}
                      width={20}
                      alt="Share"
                    />
                    <span>{post.ownPost ?? null}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Post;
