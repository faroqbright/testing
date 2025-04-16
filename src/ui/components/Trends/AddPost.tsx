import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import { getAddPost } from "@/api/methods/auth";
import { toast } from "sonner";
interface userDataState {
  username: string | undefined;
}
interface addPostProps {
  onClose: () => void;
  fetchPostFn: () => void;
}

const AddPost: React.FC<addPostProps> = ({ onClose,fetchPostFn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<userDataState>({
    username: "",
  });
  const {     
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const decodeToken = () => {
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    console.log("userName", userData.user.username);
    setUserData({
      username: userData.user.username,
    });
  };
  useEffect(() => {
    decodeToken();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const token = userData?.jwt;

    if (!data.message) {
      toast.error("Post content is empty");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("data[message]", data.message);
      formData.append("data[content][0][type]", "paragraph");
      formData.append("data[content][0][children][0][type]", "text");
      formData.append("data[content][0][children][0][text]", data.message);
      formData.append("data[tags][]", "repost");
      // formData.append("data[mentions][]", "2");
      formData.append("data[category]", "2");
      if (data.media && data.media.length > 0) {
        Array.from(data.media).forEach((file: any) => {
          formData.append("media", file);
        });
      }
      const response = await fetch("https://backend.stage.cricap.com/api/posts/create-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success("Post submitted successfully!");
        onClose();
        fetchPostFn()
      } else {
        toast.error(responseData?.error?.message || "Failed to submit post.", {
          position: "top-right",
          closeButton: true,
        });
      }
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add post.", {
        position: "top-right",
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start my-3">
        <div className="tab-profile-image">
          <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
        </div>
        <div className="flex flex-col ">
          <div className="profile-name font-semibold text-[18px] text-black">{userData.username}</div>
          <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@ {userData.username}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1 sm:col-span-1">
            <span>Add Text</span>
            <textarea
              placeholder="Write the post..."
              className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 h-[48px] rounded-lg"
              {...register("message", { required: "This field is required" })}
            />
            {errors.text && <p className="text-red-500 text-sm">This field is required</p>}
          </div>
          <div className="col-span-1 sm:col-span-1">
            <span>Add Media</span>
            <Input
              type="file"
              className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 h-[48px] rounded-lg"
              {...register("media")}
              multiple
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="py-1 px-4 my-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px] text-end"
        >
          {isLoading ? "Loading...!" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
