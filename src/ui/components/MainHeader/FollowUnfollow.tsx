import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/api/config";

const FollowUnfollow = (props: any) => {
  // console.log("🚀 ~ FollowUnfollow ~ props:", props);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const authh = localStorage.getItem("auth");
  const userDataa = authh ? JSON.parse(authh) : null;
  const token = userDataa?.jwt;

  const handleFollow = async () => {
    if (!token) {
      toast.error("You need to log in to perform this action.", {
        position: "top-right",
        closeButton: true,
      });
      return;
    }
    setLoading(true);
    try {
      const apiUrl = props.bit
        ? `${BASE_URL}/users/unfollow/${props?.id}`
        : `${BASE_URL}/users/follow/${props.id}`;

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      props?.onSearch();
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`font-bold px-6 py-1 rounded-md mt-5 text-[20px] ${props.bit ? "bg-mainGreen" : "bg-black"} text-white`}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? "Processing..." : props.bit ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowUnfollow;
