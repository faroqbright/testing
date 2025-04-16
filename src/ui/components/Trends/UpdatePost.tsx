import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import { FeedPost } from "@/@types/feed";
import { updatePost } from "@/api/methods/auth";
import { useQueryState } from "nuqs";
import axios from "axios";

interface UpdatePostProps {
  previousData: any;
  onClose: () => void;
}

interface UserDataState {
  username: string | undefined;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ previousData, onClose }) => {
  const [modalPostId] = useQueryState("modal_post_id");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataState>({ username: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const decodeToken = () => {
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    if (userData?.user) {
      setUserData({ username: userData.user.username });
    }
  };
  useEffect(() => {
    decodeToken();
    if (previousData) {
      reset({
        message: previousData.message || "",
        media: previousData.media || "",
      });
    }
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const token = userData?.jwt;
    const updatedFields = {
      data: {
        message: data.message,
        content: data.content,
      },
    };
    if (data.message === previousData.message) {
      toast.error("No changes detected.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Updated Fields:", updatedFields);
      const response = await axios.put(`https://backend.stage.cricap.com/api/posts/${modalPostId}`, updatedFields, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data) {
        toast.success("Post updated successfully!");
        reset();
        onClose();
      } else {
        console.error("Failed to update the post. Response:", response.data);
        toast.error("Failed to update post.");
      }
    } catch (error: any) {
      console.error("Error updating post:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to update post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start my-3">
        <div className="tab-profile-image">
          <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="User" />
        </div>
        <div className="flex flex-col">
          <div className="profile-name font-semibold text-[18px] text-black">{userData?.username}</div>
          <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@{userData?.username}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block mb-1">Update Text</label>
            <textarea
              placeholder="Write the post..."
              className={`w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 rounded-lg ${
                errors.message ? "border-red-500" : ""
              }`}
              {...register("message", { required: "This field is required" })}
            />
          </div>
          {/* <div className="col-span-1">
            <label className="block mb-1">Update Media</label>
            <Input
              type="file"
              className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 rounded-lg"
              {...register("media")}
            />
          </div> */}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="py-1 px-4 my-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]"
        >
          {isLoading ? "Loading..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
