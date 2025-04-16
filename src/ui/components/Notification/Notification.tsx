"use client";
import React, { useState } from "react";
import Img from "../Img/Img";

const Notification = () => {
  return (
    <div>
      <div className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
        <span className="cric-bg absolute top-[20px] md:top-[0px] right-[0] md:right-[250px]">
          <Img src={"/assets/imgs/bg/cric-bg.png"} height={240} width={240} alt="" />
        </span>
      </div>
      <div className="profile-wrapper relative flex flex-col md:flex-row items-start justify-between bg-white">
        <div className="profile-d flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-2 relative top-[-70px] md:top-[-110px] left-[20px] md:left-[50px] ">
          <div className="profile-image w-[130px] h-[130px] md:w-[200px] md:h-[200px] ">
            <Img src={"/assets/imgs/icons/notification.svg"} height={250} width={250} alt="" />
            <div className="font-semibold text-[26px] text-center text-black">Notifications</div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-t-[#9E9E9E]">
        <div className="flex items-start gap-2 py-4 px-[20px]">
          <div className="tab-profile-image">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
          </div>
          <div className="profile-content-wrapper w-[100%]">
            <div className="flex flex-col items-start gap-1">
              <p className="text-[#464646] w-[100%] md:w-[65%]">
                <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                mentioned you in her comment on invoices forecast graph
              </p>
              <div className="text-[#9E9E9E] text-[16px] font-normal ">
                <span>2</span> days ago
              </div>
            </div>
          </div>
        </div>
        <div className=" flex items-start gap-2 py-4 px-[20px]">
          <div className="tab-profile-image">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
          </div>
          <div className="profile-content-wrapper w-[100%]">
            <div className="flex flex-col items-start gap-1">
              <p className="text-[#464646] w-[100%] md:w-[65%]">
                <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                mentioned you in her comment on invoices forecast graph
              </p>
              <div className="text-[#9E9E9E] text-[16px] font-normal ">
                <span>2</span> days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
