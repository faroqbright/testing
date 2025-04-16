import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { deletePostComment, getReplay } from "@/api/methods/auth";
import axios from "axios";
import { log } from "console";
import { BASE_URL } from "@/api/config";

dayjs.extend(relativeTime);

interface Comment {
  id: string;
  user: {
    username: string;
  };
  commentText: string;
  createdAt: string;
}

interface Reply {
  id: string;
  user: {
    username: string;
  };
  commentText: string;
  replyText: string;
  createdAt: string;
}

interface DisplayCommentProps {
  postId: number;
  postComments: any[];
  toggleDropdownComment: (commentId: number) => void;
  commentOpenDropdownId: number | null;
  handleEditComment: (postId: number, commentId: number, commentText: string) => void;
  handleDeleteComment: (commentId: number, postId: number) => Promise<void>;
}

const DisplayComment: React.FC<DisplayCommentProps> = ({
  postComments,
  toggleDropdownComment,
  commentOpenDropdownId,
  handleEditComment,
  handleDeleteComment,
  postId,
}) => {
  const [replayComments, setReplayComments] = useState<Record<string, Reply[]>>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [replayCommentOpenDropdownId, setReplayCommentOpenDropdownId] = useState<string | null>(null);
  useEffect(() => {
    postComments.forEach((comment) => {
      getReplayComments(comment.id);
    });
  }, [postComments]);
  const getReplayComments = async (commentId: string) => {
    try {
      const response = await getReplay(commentId);
      // console.log("get replay data ", response);

      if (response && Array.isArray(response.data.results)) {
        setReplayComments((prevState) => ({
          ...prevState,
          [commentId]: response.data.results,
        }));
      }
    } catch (error) {
      console.error("Error fetching replay comments", error);
    }
  };

  // Handle reply submission for a specific comment
  const handleReplySubmit = async (commentId: string) => {
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const token = userData?.jwt;

    if (!replyText.trim()) return;

    try {
      const commentPayload = {
        data: {
          commentText: replyText,
          user: userData?.id || "user_id_or_string",
          post: postId,
          media: null,
          likesCount: 0,
          likes: [],
          childComments: [],
          parentComment: commentId,
        },
      };

      const response = await axios.post(`${BASE_URL}/comments`, commentPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const newReply = response.data.results;

        setReplayComments((prevState) => ({
          ...prevState,
          [commentId]: [...(prevState[commentId] || []), newReply],
        }));
        await getReplayComments(commentId);
        setReplyText("");
        setActiveReplyCommentId(null);
      } else {
        console.error("Failed to post reply", response);
      }
    } catch (error) {
      console.error("Error posting reply", error);
    }
  };
  // Handle delete replay comment
  const handleReplyDelete = async (replyId: string) => {
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const token = userData?.jwt;
    const commentId = Object.keys(replayComments).find((id) =>
      replayComments[id].some((reply) => reply.id === replyId)
    );

    if (!commentId) {
      console.error("Comment not found for the reply ID");
      return;
    }

    try {
      const response = await deletePostComment(replyId);

      console.log("Deleted reply ID:", response);

      setReplayComments((prevState) => ({
        ...prevState,
        [commentId]: prevState[commentId]?.filter((reply) => reply.id !== replyId),
      }));
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  // Toggle the dropdown for the specific reply
  const toggleReplayDropdown = (replyId: string | null) => {
    setReplayCommentOpenDropdownId((prev) => (prev === replyId ? null : replyId));
  };

  return (
    <div className="w-full scrollbar-hide">
      {/* Display comments */}
      {postComments?.map((comment) => (
        <div key={comment.id} className="flex gap-2 my-3 ">
          <div className="comment-content flex flex-col gap-2 bg-[#F5F5F5] p-3 rounded-lg w-full">
            <div className="flex gap-2 bg-[#F5F5F5] p-3 rounded-lg w-full">
              <div>
                <Img
                  src={"/assets/imgs/icons/LoginUser.png"}
                  height={50}
                  width={50}
                  alt="User"
                  className="rounded-full"
                />
              </div>
              <div className="w-full">
                <div className="flex gap-2 items-center justify-between w-full">
                  <span className="font-semibold text-black text-[16px]">{comment?.user?.username}</span>
                  <div className="w-full text-end flex flex-col items-end relative">
                    {/* <button
                      onClick={() => toggleDropdownComment(comment.id)}
                      className="text-black dark:hover:bg-[#E7E7E7] rounded-lg font-medium text-lg px-2 pb-2 text-center inline-flex items-center h-[25px]"
                    >
                      ...
                    </button> */}
                    {commentOpenDropdownId === comment.id && (
                      <div className="z-10 divide-y divide-gray-100 rounded-lg shadow-lg w-40 bg-white text-end absolute top-[30px]">
                        <ul className="py-2 text-sm dark:text-gray-200">
                          <li className="cursor-pointer">
                            <a
                              className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[#439B45]"
                              onClick={() => handleEditComment(postId, comment.id, comment.commentText)}
                            >
                              Update
                            </a>
                          </li>
                          <li className="cursor-pointer" onClick={() => handleDeleteComment(comment.id, postId)}>
                            <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[red]">
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[#464646] text-[14px] mt-2">{comment.commentText}</p>
                <div className="mt-2 flex justify-between gap-4 text-sm text-[#9E9E9E]">
                  <div className="flex gap-4 text-sm">
                    <span className="cursor-pointer">Likes</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveReplyCommentId(comment.id);
                      }}
                    >
                      Reply
                    </span>
                  </div>
                  {/* <span>{dayjs(comment.Date).fromNow()}</span> */}
                </div>
              </div>
            </div>

            {/* Display reply input if Reply is clicked */}
            {activeReplyCommentId === comment.id && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  placeholder="Write a reply..."
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="bg-mainGreen text-white p-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            )}

            {/* Display replay comments */}
            {replayComments[comment.id]?.length > 0 ? (
              replayComments[comment.id].map((reply) => (
                <div key={reply?.id} className="flex self-end gap-2 bg-[#F5F5F5] px-3 rounded-lg w-[90%] mt-2">
                  <div className="replay-img">
                    <Img
                      src={"/assets/imgs/icons/LoginUser.png"}
                      height={30}
                      width={30}
                      alt="User"
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex gap-2 items-center justify-between w-full">
                      <span className="font-semibold text-black text-[16px]">{reply?.user?.username}</span>
                      <div className="w-full text-end flex flex-col items-end relative">
                        <button
                          onClick={() => toggleReplayDropdown(reply.id)}
                          className="text-black dark:hover:bg-[#E7E7E7] rounded-lg font-medium text-lg px-2 pb-2 text-center inline-flex items-center h-[25px]"
                        >
                          ...
                        </button>
                        {replayCommentOpenDropdownId === reply?.id && (
                          <div className="z-10 divide-y divide-gray-100 rounded-lg shadow-lg w-40 bg-white text-end absolute top-[30px]">
                            <ul className="py-2 text-sm dark:text-gray-200">
                              <li className="cursor-pointer">
                                <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[#439B45]">
                                  Update
                                </a>
                              </li>
                              <li className="cursor-pointer" onClick={() => handleReplyDelete(reply.id)}>
                                <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[red]">
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[#464646] text-[14px] mt-2">{reply?.commentText}</p>
                    <span className="text-[#9E9E9E] text-sm">{dayjs(reply?.createdAt).fromNow()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#9E9E9E] text-sm mt-2">No replies yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayComment;
