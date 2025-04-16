"use client";
import React, { useEffect, useState } from "react";
import { HTMLAttributes } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useQueryState } from "nuqs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FeedPost } from "@/@types/feed";
import {
  getPostsNew,
  commentPost,
  likePost,
  deletePost,
  deletePostComment,
  getUpdatePost,
  postBatch,
} from "@/api/methods/auth";
import Loading from "@/app/loading";
import { AddModel } from "./Models";
import PostComments from "./PostComments";
import ReportModal from "./ReportModal";
import Img from "../Img/Img";
dayjs.extend(relativeTime);
import DisplayComment from "./DisplayComment";
import { BASE_URL } from "@/api/config";

interface CricapQProps extends HTMLAttributes<HTMLDivElement> {}

interface PostsDataState {
  isError: boolean;
  isLoading: boolean;
  data: FeedPost[] | undefined;
}

const CricapQ: React.FC<CricapQProps> = ({ ...props }) => {
  const authh = localStorage.getItem("auth");
  const [postsData, setPostsData] = useState<PostsDataState>({ isError: false, isLoading: true, data: undefined });
  const [commentsData, setCommentsData] = useState<{ [key: number]: any[] }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: number | null }>({});
  const [isFetching, setIsFetching] = useState(false);
  const userDataa = authh ? JSON.parse(authh) : null;
  const token = userDataa?.jwt;
  const [_, setModalPost] = useQueryState("modal_post_id");
  const [messages, setMessages] = useState<{ [key: number]: string }>({});
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [commentOpenDropdownId, setCommentOpenDropdownId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const toggleDropdown = (postId: number) => {
    setOpenDropdownId((prevId) => (prevId === postId ? null : postId));
  };

  const toggleDropdownComment = (commentId: number) => {
    setCommentOpenDropdownId((prevId) => (prevId === commentId ? null : commentId));
  };

  const handleBlockModal = (postId: number) => {
    setOpenDropdownId(postId);
    setShowBlockModal(true);
  };

  const handleCloseModal = () => {
    setShowReportModal(false);
    setShowBlockModal(false);
  };

  const handleReportSubmit = async (reportData: {
    reportType: string;
    reason: string;
    contentId: string;
    reportedBy: string;
  }) => {
    try {
      if (token) {
        await axios.post(
          `${BASE_URL}/reports`,
          { data: reportData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Report submitted successfully!");
        setShowReportModal(false);
      } else {
        toast.error("Please login to perform any actions.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleBlockUser = async (post: any) => {
    try {
      if (token) {
        await axios.post(
          `${BASE_URL}/users/block/${post.user.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User blocked successfully!");
        setShowBlockModal(false);
      } else {
        toast.error("Please login to perform any actions.");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user. Please try again.");
    }
  };

  console.log("Posts data in component:", postsData?.data);

  const handleInputChange = (event: any, postId: number) => {
    const value = event?.target?.value;
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: value,
    }));
  };
  const handleEditComment = (postId: number, commentId: number, commentText: string) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: commentText,
    }));

    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [postId]: commentId,
    }));
  };

  const fetchPosts = async (page: number) => {
    setIsFetching(true);

    try {
      const response = await getPostsNew(page);
      const newPosts = response?.data?.feed?.data || [];

      const sortedPosts = newPosts.sort((a: any, b: any) => b.id - a.id);

      setPostsData((prev) => ({
        ...prev,
        data: [
          ...(prev?.data || []).filter((post) => !newPosts.some((newPost: any) => newPost.id === post.id)),
          ...sortedPosts,
        ],
        isLoading: false,
      }));

      const commentsPromises = sortedPosts.map(async (post: any) => {
        const commentData = await commentPost(post.id);
        return { postId: post.id, comments: commentData.data?.results || [] };
      });

      const commentsResults = await Promise.all(commentsPromises);

      setCommentsData((prev) => ({
        ...prev,
        ...commentsResults.reduce((acc, { postId, comments }) => {
          acc[postId] = comments;
          return acc;
        }, {}),
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPostsData((prev) => ({ ...prev, isError: true, isLoading: false }));
    } finally {
      setIsFetching(false);
    }
  };

  const loadMorePosts = async () => {
    const nextPage = currentPage + 1;
    await fetchPosts(nextPage);
    setCurrentPage(nextPage);
    const payload = {
      post: postsData?.data?.length || 0,
      user: userDataa?.user?.id || null,
    };

    if (!payload.user) {
      console.error("User ID is missing in the payload.");
      return;
    }

    try {
      // Call postBatch API
      await postBatch(payload);
      console.log("postBatch API called successfully with payload:", payload);
    } catch (error) {
      console.error("Error in postBatch API call:", error);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLikePost = async (postId: number) => {
    try {
      if (token) {
        await likePost(postId);
        setPostsData((prev) => {
          if (!prev.data) return prev;
          const updatedData = prev.data.map((post) => {
            const userId = userDataa?.user?.id;
            if (post.id === postId && userId) {
              return {
                ...post,
                likesCount: post.likedByUser ? (post.likesCount ?? 0) - 1 : (post.likesCount ?? 0) + 1,
                likedByUser: !post.likedByUser,
              };
            }
            return post;
          });
          return { ...prev, data: updatedData };
        });
      } else {
        toast.error("Please login to perform any actions.");
      }
    } catch (error) {
      console.error("Failed to like the post", error);
    }
  };

  const handlePostComment = async (postId: number) => {
    const commentText = messages[postId]?.replace(/&nbsp;/g, " ").trim();
    if (!token) {
      toast.error("Please login to perform any actions.");
      return;
    }

    try {
      const commentPayload = {
        commentText,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        post: postId,
        updatedAt: new Date().toISOString(),
      };

      if (editMode[postId] != null) {
        const commentId = editMode[postId];
        commentPayload.updatedAt = new Date().toISOString();
        await axios.put(
          `${BASE_URL}/comments/${commentId}`,
          { data: commentPayload },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (commentText) {
        await axios.post(
          `${BASE_URL}/comments`,
          { data: commentPayload },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchPosts(1);
      setMessages((prevMessages) => ({ ...prevMessages, [postId]: "" }));
      setEditMode((prevEditMode) => ({ ...prevEditMode, [postId]: null }));
      window.location.reload();
    } catch (error) {
      console.error("Failed to post/update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      if (token) {
        await deletePostComment(commentId);
        setCommentsData((prevComments) => {
          const updatedComments = prevComments[postId]?.filter((c) => c.id !== commentId);
          return { ...prevComments, [postId]: updatedComments };
        });
        toast.success("Comment deleted successfully");
      } else {
        toast.error("Please login to add a post");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete comment");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      if (token) {
        await deletePost(postId);
        setPostsData((prev) => {
          if (!prev.data) return prev;
          const updatedData = prev.data.filter((post) => post.id !== postId);
          toast.success("Post deleted successfully");
          return { ...prev, data: updatedData };
        });
      } else {
        toast.error("Please login to add a post");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete post");
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  const prevDataGet = async (postId: number) => {
    try {
      const response = await getUpdatePost(postId);
      setPreviousData(response.data);
    } catch (error) {
      console.error("Error fetching previous data:", error);
    }
  };
  const handleUpdateModal = (postId: number) => {
    if (isModalOpen) {
      setModalPost(null);
    } else if (openDropdownId) {
      setModalPost(openDropdownId?.toString());
      prevDataGet(postId);
    }
    setIsModalOpen((prev) => !prev);
  };
  const handleReportModal = (postId: number) => {
    setOpenDropdownId(postId);
    setShowReportModal(true);
  };

  if (postsData.isLoading) {
    return <Loading />;
  }

  // if (postsData.isError) {
  //   return <ServerError />;
  // }

  return (
    <>
      <AddModel fetchPostFn={() => fetchPosts(1)} />
      <div {...props} className="w-full h-full grid grid-cols-1 md:grid-cols-6 gap-2 bg-white">
        <div className="md:col-start-2 col-span-4 mx-[8px]">
          {postsData?.data
            ?.filter((post: any) => post?.category?.slug === "user-post")
            ?.sort((a, b) => b.id - a.id)
            ?.map((post, index) => {
              const formattedDate = dayjs(post.createdAt).fromNow();
              const postComments = commentsData[post.id] || [];

              return (
                <div
                  key={post.id}
                  className="flex flex-col items-start gap-2 my-[50px] pb-4 border-b-2 border-[#E7E7E7]"
                >
                  <div className="w-full flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="tab-profile-image">
                        <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <div className="profile-name font-semibold text-[18px] text-black">{post?.user?.username}</div>
                        <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">
                          @{post?.user?.username}
                        </div>
                      </div>
                    </div>
                    <div className="w-full text-end flex flex-col items-end relative">
                      <button
                        onClick={() => toggleDropdown(post?.id)}
                        className="text-black dark:hover:bg-[#E7E7E7] rounded-lg font-medium  text-lg px-2 pb-2 text-center inline-flex items-center h-[25px]"
                      >
                        ...
                      </button>
                      {openDropdownId === post.id && userDataa?.user?.id === post?.user?.id && (
                        <div className="z-10 divide-y divide-gray-100 rounded-lg shadow-lg w-44 bg-white text-end absolute top-[30px]">
                          <ul className="py-2 text-sm dark:text-gray-200">
                            <li className="cursor-pointer" onClick={() => handleUpdateModal(post.id)}>
                              <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[#439B45]">
                                Update
                              </a>
                            </li>
                            <li className="cursor-pointer" onClick={() => handleDeletePost(post.id)}>
                              <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[red]">
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                      {openDropdownId === post.id && userDataa?.user?.id !== post?.user?.id && (
                        <div className="z-10 divide-y divide-gray-100 rounded-lg shadow-lg w-44 bg-white text-start absolute top-[30px]">
                          <ul className="py-2 text-sm dark:text-gray-200">
                            <li className="cursor-pointer" onClick={() => handleReportModal(post.id)}>
                              <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[#439B45]">
                                Report
                              </a>
                            </li>
                            <li className="cursor-pointer" onClick={() => handleBlockModal(post.id)}>
                              <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[red]">
                                Block
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                      {showReportModal && (
                        <ReportModal
                          postId={post.id.toString()}
                          userId={userDataa?.user?.id}
                          onClose={handleCloseModal}
                          onSubmit={handleReportSubmit}
                        />
                      )}
                      {showBlockModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
                          <div className="bg-white p-6 rounded-lg w-1/3 flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
                            <p className="mb-4">Do you really want to block this user?</p>
                            <div className="flex justify-end space-x-2">
                              <button
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-stateCompleted hover:text-white"
                                onClick={handleCloseModal}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => handleBlockUser(post)}
                              >
                                Yes, Block
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="profile-content-wrapper w-full md:w-full lg:w-[100%]">
                    {/* content and img box */}
                    <div className="flex flex-col items-start gap-2 py-2 border-b-2 border-[#E7E7E7]">
                      <p className="text-[#464646] w-[100%]">{post.message}</p>
                      <div
                        className={`cricq-post-img p-2 ${
                          post.media ? "border-2 border-[#E7E7E7] rounded-[15px]" : "hidden"
                        }`}
                      >
                        <Img className="rounded-[15px]" src={post.media} height={350} width={700} alt="soon" />
                      </div>
                      <div className="w-[100%] flex gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <span className="flex gap-1 items-center text-[16px] text-[#464646] cursor-pointer">
                            <Img
                              src={
                                post.likedByUser
                                  ? "/assets/imgs/icons/heart-filled.svg"
                                  : "/assets/imgs/icons/heart.svg"
                              }
                              height={20}
                              width={20}
                              alt="like"
                              onClick={() => handleLikePost(post.id)}
                            />
                            <span>{post.likesCount || 0}</span>
                          </span>
                          <span className="flex gap-1 items-center">
                            <Img
                              className="cursor-pointer"
                              src={"/assets/imgs/icons/comment.svg"}
                              height={20}
                              width={20}
                              alt=""
                            />
                            <span>{post?.commentsCount || 0}</span>
                          </span>
                          <span className="flex gap-1 items-center">
                            <Img
                              className="cursor-pointer"
                              src={"/assets/imgs/icons/repeat.svg"}
                              height={20}
                              width={20}
                              alt=""
                            />
                            <span>0</span>
                          </span>
                          <span className="flex gap-1 items-center">
                            <Img
                              className="cursor-pointer"
                              src={"/assets/imgs/icons/share-btn.svg"}
                              height={20}
                              width={20}
                              alt=""
                            />
                            <span>{post?.commentsCount || 0}</span>
                          </span>
                        </div>
                        <div className="text-[#9E9E9E]">
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <p className="text-[#9E9E9E]">
                        Like by <span>{post?.mentions?.map((mention) => mention.username).join(", ")}</span>, and Others
                        <span>{post.likes}</span>
                      </p>
                    </div>
                    <div key={index} className="flex flex-col items-start gap-2 my-[30px]">
                      {/* Other post-related code */}
                      <PostComments
                        post={post}
                        messages={messages}
                        handleInputChange={handleInputChange}
                        handlePostComment={handlePostComment}
                        setMessages={setMessages}
                        editMode={editMode}
                      />
                      <DisplayComment
                        postId={post.id}
                        postComments={postComments}
                        toggleDropdownComment={toggleDropdownComment}
                        commentOpenDropdownId={commentOpenDropdownId}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="w-full flex justify-center mb-5">
            <button
              onClick={loadMorePosts}
              disabled={isFetching}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              {isFetching ? "Loading..." : "Load More"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CricapQ;
