"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/global/store";
import { TagMatch, setCurrentTag } from "@/global/reducers/tagsSlice";
import TagMatches from "./TagMatches";
import HashTagCarousal from "./HashTagCarousal";
import Img from "../Img/Img";

interface TagsCarousalProps extends HTMLAttributes<HTMLDivElement> {
  tagsData: any[];
}

interface Tag {
  id: number;
  name: string;
  posts: TagMatch[];
}
const TagsCarousal: React.FC<TagsCarousalProps> = ({ tagsData, ...props }) => {
  const state = useSelector((state: RootState) => state.tagsReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setCurrentTag({
        currentTag: tagsData[0].name,
        matches: tagsData[0].posts,
      })
    );
  }, [dispatch, tagsData]);

  return (
    <div className="flex flex-col">
      <div className="flex place-items-center">
        <Img src={"/assets/imgs/icons/hashtag.svg"} alt="hashtag" height={20} width={20} className="mr-2" />
        <HashTagCarousal tagsData={tagsData} />
      </div>
      <TagMatches />
    </div>
  );
};
export default TagsCarousal;
