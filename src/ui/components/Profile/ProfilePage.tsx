"use client";
import type { HTMLAttributes } from "react";
import React, { useCallback, useEffect, useState } from "react";
import Img from "../Img/Img";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { tabListData } from "./tabData";
import DelProfile from "./DelProfile";

interface ProfilePageProps extends HTMLAttributes<HTMLDivElement> {}
interface userDataState {
  username: string | undefined;
  email: string | undefined;
  bio: string | undefined;
  joiningDate: string | undefined;
  likes: string | undefined;
  followers: string | undefined;
  fullName: string | undefined;
  following: string | undefined;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ ...props }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabListData[0]);
  const [userData, setUserData] = useState<userDataState>({
    username: "",
    fullName: "",
    email: "",
    bio: "",
    joiningDate: "",
    likes: "",
    followers: "",
    following: "",
  });
  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const token = userData?.jwt;
    console.log(userData);

    // console.log("get token ", token);
    const getDate = userData?.user?.createdAt;
    const formattedDate = dayjs(getDate).format("MMMM YYYY");

    setUserData({
      username: userData?.user.username,
      fullName: userData?.user.username,
      email: userData?.user.email,
      bio: userData?.user.bio,
      joiningDate: formattedDate,
      likes: userData?.user.likesCount,
      followers: userData?.user.followersCount,
      following: userData?.user.followingCount,
    });

    if (!auth) {
      router.push("/");
    }
  }, [router]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div {...props} className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
        <span className="cric-bg absolute top-[20px] md:top-[0px] right-[0] md:right-[250px]">
          <Img src={"/assets/imgs/bg/cric-bg.png"} height={240} width={240} alt="" />
        </span>
      </div>
      <div className="profile-wrapper relative flex flex-col md:flex-row items-start justify-between bg-white">
        <div className="profile-d flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-2 relative top-[-70px] md:top-[-110px] left-[20px] md:left-[50px] ">
          <div className="profile-image w-[130px] h-[130px] md:w-[200px] md:h-[200px] ">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={250} width={250} alt="" />
            <div className="font-semibold text-[16px] md:text-[24px] text-black">{userData.bio} </div>
          </div>
          <div className="profile-content-wrapper">
            <div>
              <div className="profile-name font-semibold text-[26px] text-black">{userData.username}</div>
              <div className="profile-nick-name font-semibold text-[20px] text-[#9E9E9E]">{userData.username}</div>
            </div>
            <div className="flex items-center gap-2">
              <Img src={"/assets/imgs/icons/celander.svg"} height={20} width={20} alt="" />
              <span className="text-[#9E9E9E] text-[20px]">Joined {userData.joiningDate} </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">{userData.likes}</span> Likes
              </div>
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">{userData.followers}</span> Follwers
              </div>
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">{userData.following}</span> Following
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 flex flex-col items-start md:items-end gap-3">
          <Link
            href={"/profile/edit"}
            className=" flex gap-2 mx-3 py-[4px] px-[20px] bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]  "
          >
            <Img src={"/assets/imgs/icons/edit-profile.svg"} height={30} width={30} alt="" />
            Edit Profile
          </Link>
          <Link
            href={"/profile/setting"}
            className=" flex gap-2 py-1 px-4 mx-3 text-center bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]  "
          >
            <Img src={"/assets/imgs/icons/setting.svg"} height={25} width={25} alt="" />
            Settings
          </Link>
          {/* <DelProfile/> */}
        </div>
      </div>
      {/* Tabs Section */}
      <div className="tabs-wrapper bg-white border-t border-t-[#E7E7E7] ">
        <div className="flex justify-start md:space-x-8 py-3">
          {tabListData.map((item, key) => (
            <button
              className={`py-2 px-4 font-semibold text-[20px] text-[#202020] ${
                item.title === activeTab.title ? "border-b-4 border-[#439B45]" : "text-[#202020]"
              }`}
              onClick={() => setActiveTab(tabListData[key])}
              key={key}
            >
              {item.title}
            </button>
          ))}
        </div>
        {/* Tab Content Section */}
        <div className="tab-content-wrapper p-4">
          <activeTab.component />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false,
});
