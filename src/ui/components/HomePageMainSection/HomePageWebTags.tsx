import type { HTMLAttributes } from "react";
import React from "react";
import MainSectionHeading from "./MainSectionHeading";
import HashTagCarousal from "../Trends/HashTagCarousal";
import TagMatches from "../Trends/TagMatches";
import Img from "../Img/Img";

interface HomePageWebTagsProps extends HTMLAttributes<HTMLDivElement> {
  tagsData: any[];
}

const HomePageWebTags: React.FC<HomePageWebTagsProps> = ({ tagsData, ...props }) => {
  return (
    <div className="2xl:col-span-6 common_main_section md:col-start-1 md:col-span-12 2xl:col-start-auto" {...props}>
      <div className="flex place-items-center  w-full">
        <Img src={"/assets/imgs/icons/hashtag.svg"} alt="hashtag" height={20} width={20} className="mr-2" />
        <MainSectionHeading className={"italic"} title="Tags" />
        <HashTagCarousal tagsData={tagsData} />
      </div>
      <TagMatches />
    </div>
  );
};
export default HomePageWebTags;
