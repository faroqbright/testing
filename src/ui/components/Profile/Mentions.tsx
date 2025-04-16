import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import { mentionsPost } from "@/api/methods/auth";
import { FeedPost, Mention } from "@/@types/feed";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
interface mentionDataState {
  isError: boolean;
  isLoading: boolean;
  data: any[] | undefined;
}
const Mentions = () => {
  const [mentionPost, setMentionPost] = useState<mentionDataState>({
    isError: false,
    isLoading: true,
    data: undefined,
  });
  useEffect(() => {
    const fetchMentionPost = async () => {
      try {
        const response = await mentionsPost();
        console.log("mention Post Data ", response);
        setMentionPost((prev) => {
          return { ...prev, data: response?.data.data };
        });
      } catch (error) {
        setMentionPost((prev) => {
          return { ...prev, isError: true };
        });
      } finally {
        setMentionPost((prev) => {
          return { ...prev, isLoading: false };
        });
      }
    };
    fetchMentionPost();
  }, []);
  console.log("mention-post fetch", mentionPost.data);
  if (mentionPost.isLoading) {
    return <Loading />;
  }

  if (mentionPost.isError) {
    return <ServerError />;
  }

  return (
    <div>
      {mentionPost.data?.map((listData, index) => {
        return (
          <div key={index} className=" flex items-start gap-2 my-4">
            <div className="tab-profile-image">
              <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
            </div>
            <div className="profile-content-wrapper w-[100%]">
              <div className="flex flex-col items-start gap-1">
                <p className="text-[#464646] w-[100%] md:w-[65%]">
                  <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                  mentioned you in her comment on invoices forecast graph
                </p>
                <div className="text-[#9E9E9E] text-[16px] font-normal ">
                  <span>2</span> days ago
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Mentions;
