"use client";
import Button from "@/ui/atoms/Button/Button";
import Input from "@/ui/atoms/Input/Input";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Img from "../Img/Img";

export interface ProfilePageProps extends HTMLAttributes<HTMLDivElement> {}
export type UpdateUserInputs = {
  username: string;
  email: string;
  password: string;
};

const EditProfile = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.push("/");
    }
  }, [router]);

  const auth = typeof window !== "undefined" ? localStorage.getItem("auth") : null;

  const userData = auth ? JSON.parse(auth) : null;

  const { register, handleSubmit } = useForm<UpdateUserInputs>({
    defaultValues: {
      email: userData?.user?.email,
      username: userData?.user?.username,
      password: "",
    },
  });

  const onSubmit = useCallback(async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <div className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
        <span className="cric-bg absolute top-[20px] md:top-[0px] right-[0] md:right-[250px]">
          <Img src={"/assets/imgs/bg/cric-bg.png"} height={240} width={240} alt="" />
        </span>
      </div>
      <div className="profile-wrapper relative flex flex-col md:flex-row items-start justify-between bg-white">
        <div className="profile-d flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-2 relative top-[-50px] md:top-[-110px] left-[20px] md:left-[50px] ">
          <div className="profile-image w-[130px] h-[130px] md:w-[200px] md:h-[200px] ">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={250} width={250} alt="" />
            <Img
              className="edit-profile-svg"
              src={"/assets/imgs/icons/edit-profile.svg"}
              height={25}
              width={25}
              alt=""
            />
            <div className="font-semibold text-[24px] text-center text-black">Edit Profile</div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t-[#9E9E9E]">
        <form
          className="w-full md:w-[60%] mx-auto flex flex-col gap-2 px-3 pb-10 h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="">User Name</label>
          <Input placeholder="username" {...register("username")} />
          {/* <label htmlFor="">Full Name</label>  */}
          {/* <Input placeholder="full name" {...register("fullname")} />  */}
          <label htmlFor="">Email</label>
          <Input placeholder="email" type="email" {...register("email")} />
          <label htmlFor="">Password</label>
          <Input placeholder="password" type="password" {...register("password")} />
          <Button>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
