import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import { getMentionComments } from "@/api/methods/auth";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
interface mentionCommentState {
  isError: boolean;
  isLoading: boolean;
  data: any[] | undefined;
}

const Comments = () => {
  const [mentionComment, setMentionComment] = useState<mentionCommentState>({
    isError: false,
    isLoading: true,
    data: undefined,
  });

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await getMentionComments();
        console.log("get Comment for login user", response.data.data);

        // Set the comment data
        setMentionComment((prev) => {
          return { ...prev, data: response.data.data };
        });
      } catch (error) {
        setMentionComment((prev) => {
          return { ...prev, isError: true };
        });
      } finally {
        setMentionComment((prev) => {
          return { ...prev, isLoading: false };
        });
      }
    };
    fetchUserComments();
  }, []);

  if (mentionComment.isLoading) {
    return <Loading />;
  }

  if (mentionComment.isError) {
    return <ServerError />;
  }

  return (
    <div>
      {mentionComment.data?.map((comment) => {
        const getDate = comment.attributes.createdAt;
        const formattedDate = dayjs(getDate).fromNow();
        return (
          <div key={comment.id} className="flex items-start gap-2 my-4">
            <div className="tab-profile-image">
              <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
            </div>
            <div className="profile-content-wrapper w-[100%]">
              <div className="flex flex-col items-start gap-1">
                <p className="text-[#464646] w-[100%] md:w-[65%]">
                  <span className="text-[#525252] font-bold text-[18px]"> </span>
                  {comment.attributes.commentText}
                </p>
                <div className="text-[#9E9E9E] text-[16px] font-normal ">{formattedDate}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
