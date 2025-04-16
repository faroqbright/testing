export interface Mention {
  id: number;
  username: string;
  email: string;
  provider: string;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  otp: string | null;
  otpExpiry: string | null;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  bio: string;
  likesCount: number;
  followersCount: number;
  followingCount: number;
  qcoinBalance: number;
}

export interface User {
  id: number;
  username: string;
}

export interface ContentChild {
  text: string;
  type: string;
}

export interface Content {
  type: string;
  children: ContentChild[];
}

export interface Repost {
  id: number;
  message: string;
  content: Content[];
  date: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface FeedPost {
  publishedAt: string;
  id: number;
  message: string;
  content: Content[] | null;
  date: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
  likes: any[]; // Adjust if likes array structure is known
  likesCount: number | null;
  likedByUser: boolean;
  commentsCount: number | null;
  mentions: Mention[];
  media:string;
  user: User;
  repost: Repost | null;
  ownPost: boolean;
  isFollowingUser: boolean;
}
