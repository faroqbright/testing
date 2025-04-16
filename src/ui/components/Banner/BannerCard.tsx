import React from "react";
import Link from "next/link";
import Img from "../Img/Img";
import img1 from "../../../../public/assets/imgs/icons/common.png";

interface BannerCardProps {
  banner: {
    id: number;
    media: string | { url: string }[];
    message: string;
  };
}

const BannerCard: React.FC<BannerCardProps> = ({ banner }) => {
  const mediaSrc = 
    typeof banner.media === "string"
      ? banner.media
      : Array.isArray(banner.media) && banner.media.length > 0
      ? banner.media.filter((post: any) => post?.category?.slug === "news")[0]?.url || img1
      : img1;

  return (
    <Link
      className="relative min-w-72 w-72 rounded-xl border-2 min-h-40 flex justify-center px-2 select-none"
      href={`/post/${banner.id}`}
    >
      <span className="bg-gradient-to-b from-[#2121218c] via-transparent to-[#1a661b] h-full w-full absolute z-10 rounded-xl"></span>
      
      <Img
        src={mediaSrc}
        fill
        className="w-full h-full object-cover rounded-xl"
        alt="banner"
      />

      <div className="flex justify-center place-items-center w-full">
        <p className="text-white z-10 bottom-2 font-bold text-sm mx-auto self-end mb-2">
          {banner.message}
        </p>
      </div>
    </Link>
  );
};

export default BannerCard;
