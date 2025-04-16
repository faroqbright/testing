import {
  postRequest,
  getRequest,
  postWithFormRequest,
  getFilterRequest,
  deleteRequest,
  getParamsRequest,
  putRequest,
} from "../index";

export const LoginAPI = (payload) => postRequest("/auth/local", payload);
export const RegisterAPI = (payload) => postRequest("/auth/local/register", payload);
export const ForgotPasswordAPI = (payload) => postRequest("/auth/forgot-password-otp", payload);
export const VerifyOtpAPI = (payload) => postRequest("/auth/verify-otp", payload);
export const ResetPasswordOtpAPI = (payload) => postRequest("/auth/reset-password-otp", payload);
export const TrendAPINew = (number) => {
  const url = `/posts/all-feed?page=${number}&perPage=10`;
  return getParamsRequest(url);
};
export const HomeAPI = () => getRequest("/homescreen/index");
export const NewsAPIForTrendsNew = () => getRequest("/posts/news-index");

export const getPost = (id) => {
  const url = `/posts/${id}`;
  return getParamsRequest(url);
};

// mongo
export const MatchesListAPIForMatches = (type) => getParamsRequest("/mongo/matches/list", { type });
export const NewsAPIForTrends = () => getRequest("/mongo/news/list");
export const SeriesListAPI = (type) => getParamsRequest("/mongo/series/list", { type });
export const NewsListAPI = (type) => getParamsRequest("posts/news-index", { type });
export const TeamsListAPI = (type) => getParamsRequest("/mongo/teams/list", { type });

export const SeriesGetMatchesListAPI = (NewsID) => {
  const url = `/mongo/series/get-matches/${NewsID}`;
  return getParamsRequest(url);
};

export const getNewsDetailsAPI = (NewsID) => {
  const url = `/mongo/news/${NewsID}`;
  return getParamsRequest(url);
};

export const getMatchDetailsAPI = (matchId) => {
  const url = `/mongo/matches/${matchId}`;
  return getParamsRequest(url);
};

export const getMatchCommentariesAPI = (matchId) => {
  const url = `/mongo/matches/${matchId}/commentaries`;
  return getRequest(url);
};
export const getMatchScorecardAPI = (matchId) => {
  const url = `/mongo/matches/${matchId}/scorecard`;
  return getRequest(url);
};
export const getMatchTeamDetailsAPI = (matchId, teamId) => {
  const url = `/mongo/matches/${matchId}/team/${teamId}`;
  return getRequest(url);
};
export const getMatchHighLigtsAPI = (matchId) => {
  const url = `/mongo/matches/${matchId}/highlights`;
  return getRequest(url);
};
export const getMatchAnalysisAPI = (matchId) => {
  const url = `/mongo/matches/${matchId}/analysis`;
  return getRequest(url);
};
export const getPlayerDetailAPI = (playerId) => {
  const url = `/mongo/players/${playerId}`;
  return getRequest(url);
};

export const getMe = () => {
  return getRequest("/users/me");
};
export const getPostsNew = (nextPage) => {
  return getRequest(`/posts/all-feed?page=${nextPage}&perPage=10`);
};
export const getPosts = () => {
  return getRequest("/posts/all-feed");
};
export const postBatch = (payload) => {
  // Convert only the value (e.g., 60, 40) into a string and send as an array
  const stringifiedPayload = {
    post: `${payload.post}`, // Convert the numeric value to a string
    user: `${payload.user}`, // Convert the numeric value to a string
  };

  return postRequest("/views/batch-view", {
    data: [stringifiedPayload], // Wrap in an array
  });
};

export const getOwnPosts = () => {
  return getRequest("/posts/own-feed");
};
export const likePost = (postId, userId) => {
  return postRequest("/likes/like-a-post", {
    data: {
      // user: userId,
      post: postId,
    },
  });
};

export const commentPost = (id) => {
  return getRequest(`/comments/post/${id}`);
};
export const addPostComment = (postId, userId, commentText, likesCount, createdAt, updatedAt) => {
  return postRequest(`/comments`, {
    post: postId,
    // id: userId,
    commentText,
    likesCount,
    createdAt,
    updatedAt,
  });
};

export const mentionsPost = () => {
  return getRequest(`/posts/mentioned-posts`);
};
export const getMentionComments = () => {
  return getRequest(`/comments`);
};
export const getAddPost = (payload) => {
  return postWithFormRequest(`/posts`, payload);
};
export const deletePost = (id) => {
  return deleteRequest(`/posts/${id}`);
};
export const deletePostComment = (id) => {
  return deleteRequest(`/comments/${id}`);
};
export const updatePost = (id, formData) => {
  return putRequest(`/posts/${id}`, formData);
};
export const getUpdatePost = (id) => {
  return getRequest(`/posts/${id}`);
};
export const getReplay = (commentId) => {
  return getRequest(`comments/comment/${commentId}`);
};
export const getSearch = (keyword) => {
  return getRequest(`homescreen/search?keyword=${keyword}`);
};
export const getSearchWithoutKey = () => {
  return getRequest(`homescreen/search`);
};
