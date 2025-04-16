"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/global/store";
import { TagMatch, setCurrentTag } from "@/global/reducers/tagsSlice";

interface HashTagCarousalProps extends HTMLAttributes<HTMLDivElement> {
  tagsData: Tag[];
}

interface Tag {
  id: number;
  name: string;
  posts: TagMatch[];
}

const HashTagCarousal: React.FC<HashTagCarousalProps> = ({ tagsData, ...props }) => {
  const state = useSelector((state: RootState) => state.tagsReducer);
  const dispatch = useDispatch();
  const [emblaRef] = useEmblaCarousel({ dragFree: true });  

  useEffect(() => {
    if (tagsData.length > 0) {
      const allPosts = tagsData.flatMap((tag) =>
        tag.posts.map((post) => ({ ...post, tagName: tag.name }))
      );
      dispatch(setCurrentTag({ currentTag: "All", matches: allPosts }));
    }
  }, [tagsData, dispatch]);
  

  const handleTagSelection = (tag: Tag | null) => {
    let updatedMatches: TagMatch[] = [];
  
    if (!tag) {
      updatedMatches = tagsData.flatMap((t) =>
        t.posts.map((post) => ({ ...post, tagName: t.name }))
      );
    } else {
      updatedMatches = tag.posts.map((post) => ({ ...post, tagName: tag.name }));
    }
  
    dispatch(setCurrentTag({ currentTag: tag ? tag.name : "All", matches: updatedMatches }));
  };
  
  const currentTag = state.currentTag || "All";

  return (
    <div className="overflow-hidden py-4 md:mx-2 w-full select-none" ref={emblaRef}>
      <div className="flex place-items-center justify-between md:justify-normal w-full gap-2">
        <button
          onClick={() => handleTagSelection(null)}
          className={`${
            currentTag === "All" ? "text-mainGreen font-semibold" : "text-gray-600 text-opacity-50"
          } text-nowrap italic`}
        >
          All
        </button>

        {tagsData?.map((tag) => (
          <button
            onClick={() => handleTagSelection(tag)}
            className={`${
              currentTag === tag.name ? "text-mainGreen font-semibold" : "text-gray-600 text-opacity-50"
            } text-nowrap italic`}
            key={tag.id}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HashTagCarousal;
