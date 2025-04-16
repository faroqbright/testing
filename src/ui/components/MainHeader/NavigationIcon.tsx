"use client";
import { ModalNames } from "../Modal/types";
import dynamic from "next/dynamic";
import Img from "../Img/Img";
import { useEffect, useRef, useState } from "react";
import { commentPost, deletePostComment, getPosts, getSearch, getSearchWithoutKey, likePost } from "@/api/methods/auth";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FollowUnfollow from "./FollowUnfollow";
import axios from "axios";
import PostComments from "../Trends/PostComments";
import DisplayComment from "../Trends/DisplayComment";
import { toast } from "sonner";
import { FeedPost } from "@/@types/feed";
import { BASE_URL } from "@/api/config";

interface NavigationIconProps {
  src: string;
  title: string;
  modal: ModalNames;
}
interface postsDataState {
  isError: boolean;
  isLoading: boolean;
  data: FeedPost[] | undefined;
}

const NavigationIcon: React.FC<NavigationIconProps> = ({ src, title, modal }) => {
  const authh = localStorage.getItem("auth");
  const userDataa = authh ? JSON.parse(authh) : null;
  const token = userDataa?.jwt;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState({
    recommendedAccounts: [],
    relatedNews: [],
    relatedPosts: [],
    trendingTags: [],
  });
  const [liked, setLiked] = useState(false);
  const handleLikePost = async (postId: string) => {
    try {
      setLiked(!liked);
      const res = await likePost(postId);
      if (res) {
        if (searchKeyword.trim()) getSearchData(searchKeyword.trim());
        getSearchDataWithOut();
      }
      setLiked(res.data.status === "Unliked" ? false : true);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const fetchData = async () => {
    if (searchKeyword.trim()) {
      await getSearchData(searchKeyword.trim());
    } else {
      await getSearchDataWithOut();
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchKeyword]);
  const getSearchDataWithOut = async () => {
    try {
      const response = await getSearchWithoutKey();
      setSearchResults(response.data);
      const postIds = response.data?.relatedPosts?.map((post: any) => post.id);
      const commentsPromises = postIds.map((postId: any) => commentPost([postId]));
      const commentsData = await Promise.all(commentsPromises);
      const groupedComments = commentsData.reduce((acc, data, index) => {
        const postId = postIds[index];
        acc[postId] = data.data?.results || [];
        return acc;
      }, {});
      setPostsData(groupedComments);
    } catch (error) {
      console.error("Error fetching search data: ", error);
    }
  };
  const getSearchData = async (keyword: string) => {
    try {
      const response = await getSearch(keyword);
      setSearchResults(response.data);
      const postIds = response.data?.relatedPosts?.map((post: any) => post.id);
      const commentsPromises = postIds.map((postId: any) => commentPost([postId]));
      const commentsData = await Promise.all(commentsPromises);
      const groupedComments = commentsData.reduce((acc, data, index) => {
        const postId = postIds[index];
        acc[postId] = data.data?.results || [];
        return acc;
      }, {});
      setPostsData(groupedComments);
    } catch (error) {
      console.error("Error fetching search data: ", error);
    }
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setSearchKeyword(value.trim());
    }, 300);
  };
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      getSearchData(searchKeyword);
    } else {
      alert("Please enter a keyword to search.");
    }
  };
  const handleTagClick = (tag: string) => {
    setSearchKeyword(tag);
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "No date available";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [commentsData, setCommentsData] = useState<{ [key: number]: any[] }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: number | null }>({});
  const [commentOpenDropdownId, setCommentOpenDropdownId] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string }>({});
  const [postsData, setPostsData] = useState([]);
  const handleInputChange = (event: any, postId: number) => {
    const value = event?.target?.value;
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: value,
    }));
  };
  const auth = localStorage.getItem("auth");
  const userData = auth ? JSON.parse(auth) : null;
  const handlePostComment = async (postId: number) => {
    const commentText = messages[postId]?.replace(/&nbsp;/g, " ").trim();
    const userId = userData?.user?.id;
    const token = userData?.jwt;
    if (!userId) {
      console.log("Missing user");
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
        // Update existing comment
        const commentId = editMode[postId];
        console.log("Updating comment with ID: ", commentId);
        commentPayload.updatedAt = new Date().toISOString();

        const response = await axios.put(
          `${BASE_URL}/comments/${commentId}`,
          { data: commentPayload },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          fetchData();
          setMessages((prevMessages) => ({
            ...prevMessages,
            [postId]: "",
          }));
          setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: null,
          }));
        }
      } else {
        // Check if commentText is empty for new comment
        if (commentText) {
          // Create a new comment
          const response = await axios.post(
            `${BASE_URL}/comments`,
            { data: commentPayload },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data) {
            fetchData();
            setMessages((prevMessages) => ({
              ...prevMessages,
              [postId]: "",
            }));
          }
        } else {
          console.log("Cannot post empty comment");
        }
      }
    } catch (error) {
      console.error("Failed to post/update comment:", error);
    }
  };
  // Toggle dropdown for each comment
  const toggleDropdownComment = (commentId: number) => {
    setCommentOpenDropdownId(commentOpenDropdownId === commentId ? null : commentId);
  };
  // Function to handle editing a comment
  const handleEditComment = (postId: number, commentId: number, commentText: string) => {
    // Populate the input field with the comment content
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: commentText,
    }));

    // Set edit mode with the comment ID
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [postId]: commentId,
    }));
  };
  // Handle delete comment API
  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      await deletePostComment(commentId);
      setCommentsData((prevComments) => {
        const updatedComments = prevComments[postId]?.filter((c) => c.id !== commentId);
        return { ...prevComments, [postId]: updatedComments };
      });

      toast.success("Comment deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete comment");
    }
  };
  return (
    <>
      <button onClick={toggleModal}>
        <Img src={src} width={25} height={25} alt={title} title={title} role={title} />
      </button>
      {isModalOpen && (
        <div className="fixed z-10 overflow-y-auto top-0 w-full left-0">
          <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <div
              className="inline-block align-center bg-white rounded-lg text-left shadow-xl transform transition-all w-[70%] sm:my-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white shadow-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-scroll h-[700px] relative">
                <button className="absolute top-[15px] right-[15px]" title="close" onClick={toggleModal}>
                  <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
                </button>
                <div className="my-5">
                  <form className="flex items-center ">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="simple-search"
                        value={searchKeyword}
                        onChange={handleSearchInput}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5   dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search branch name..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={handleSearch}
                      className="p-2.5 ms-2 text-sm font-medium text-white bg-mainGreen rounded-lg border border-mainGreen hover:bg-mainGreen focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-mainGreen dark:hover:bg-mainGreen dark:focus:ring-mainGreen"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </button>
                  </form>
                  <div id="tags">
                    <h2 className="text-xl font-bold my-6"> Related Tags</h2>
                    {searchResults.trendingTags.length > 0 ? (
                      <div className="flex items-center justify-center gap-5 my-4 flex-wrap">
                        {searchResults.trendingTags.map((tags: any, index: number) => (
                          <div key={index}>
                            <button className="tags-styled" onClick={() => handleTagClick(tags.name)}>
                              {tags.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-600 text-center"> No Tags Available </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold my-6"> Suggested For You</h2>
                    {searchResults.recommendedAccounts.length > 0 ? (
                      <Slider {...settings}>
                        {searchResults.recommendedAccounts.map((list: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col bg-[#d3d3d3] items-center justify-center mx-auto !w-[200px] h-[250px] p-4 rounded-lg overflow-hidden"
                          >
                            <div className="flex items-center justify-center w-full">
                              <Img
                                src={"/assets/imgs/icons/LoginUser.png"}
                                height={70}
                                width={70}
                                alt=""
                                className="mx-auto"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center text-center w-full">
                              <h2 className="font-bold lg:text-base md:text-xl">{list.username}</h2>
                              <h2 className="font-bold lg:text-base md:text-xl">{list.id}</h2>
                              <h4 className="lg:text-base md:text-xl break-words px-2">{list.email}</h4>
                            </div>

                            <div className="mt-auto w-full flex justify-center">
                              <FollowUnfollow id={list.id} bit={list.isFollowingUser} onSearch={fetchData} />
                            </div>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="text-gray-600 text-center"> No Data Available </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold my-6"> Related News</h2>
                    {/* Related News */}
                    {searchResults.relatedNews.length > 0 ? (
                      <div className="flex items-center justify-between flex-wrap">
                        {searchResults.relatedNews.map((news: any, index: number) => (
                          <div key={index} className="related-data lg:w-[100%] xl:w-[48%] ">
                            <Link
                              href={`/post/${news?.id}`}
                              onClick={toggleModal}
                              className="flex place-items-center h-full w-full justify-start gap-2 cursor-pointer"
                            >
                              <div className="relative h-[100px] w-[100px] min-w-[30%] rounded-lg">
                                <Img src={news.media?.[0]?.url} alt="img" fill className="object-cover rounded-lg" />
                              </div>
                              <div className="flex flex-col justify-between pl-2 gap-2">
                                <p className="line-clamp-3">{news.message}</p>
                                <span className="text-xs text-gray-500">{formatDate(news.date)}</span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-600 text-center"> No Data Available </div>
                    )}
                  </div>
                  {/* Related Posts */}
                  <div>
                    <h2 className="text-xl font-bold my-6">Related Posts</h2>
                    {searchResults.relatedPosts.length > 0 ? (
                      <div className="flex items-baseline justify-between flex-wrap">
                        {searchResults.relatedPosts.map((post: any, index: number) => {
                          return (
                            <div key={index} className="related-posts lg:w-[100%] xl:w-[48%]">
                              <div className="flex items-center">
                                <div className="tab-profile-image">
                                  <Img src={"/assets/imgs/icons/LoginUser.png"} height={55} width={55} alt="avator" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="profile-name font-semibold text-[18px] text-black">
                                    {post?.user?.username}
                                  </div>
                                  <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">
                                    @{post?.user?.username}
                                  </div>
                                </div>
                              </div>
                              <div className="w-[100%] flex flex-col items-start justify-start gap-2">
                                <p className="font-bold lg:text-base text-gray-600">{post.message}</p>
                              </div>
                              {post.media?.[0]?.url ? (
                                <div className="post-img relative">
                                  <div className="post-img relative">
                                    <img
                                      src={post.media[0].url}
                                      alt={post.message || "Post"}
                                      className="w-full h-auto object-cover"
                                    />
                                  </div>
                                </div>
                              ) : null}
                              <span className="text-gray-600 text-lg">
                                {post.content?.[0]?.children?.[0]?.text || "No content available"}
                              </span>
                              <div className="w-[100%] flex items-center justify-between mt-2">
                                <div className="flex items-center justify-between gap-2">
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
                                  <span className="text-gray-600 text-sm">Reads: {post.readTimes || 0}</span>
                                </div>
                                <span className="text-gray-600 text-sm">{formatDate(post.date)}</span>
                              </div>
                              <div key={index} className="flex flex-col items-start gap-2 my-[20px] w-[100%]">
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
                                  postComments={postsData[post.id] || []}
                                  toggleDropdownComment={toggleDropdownComment}
                                  commentOpenDropdownId={commentOpenDropdownId}
                                  handleEditComment={handleEditComment}
                                  handleDeleteComment={handleDeleteComment}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-600 text-center"> No Data Avaiable </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(NavigationIcon), {
  ssr: false,
});
