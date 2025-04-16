import type { HTMLAttributes } from "react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/global/store";
import { setCurrentTag, TagMatch } from "@/global/reducers/tagsSlice";
import Img from "../Img/Img";
import Link from "next/link";

interface NewsBannerProps extends HTMLAttributes<HTMLDivElement> {
  match: TagMatch;
  currentTag: string;
}

const NewsBanner: React.FC<NewsBannerProps> = ({ match, currentTag, ...props }) => {
  const dispatch = useDispatch();
  const allMatches = useSelector((state: RootState) => state.tagsReducer.matches);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
        setTimer(null);
      }
    };
  }, [timer]);

  const handleTagClick = () => {
    if (currentTag === match.tagName) return;

    dispatch(setCurrentTag({ currentTag: "", matches: [] }));

    const newTimer = setTimeout(() => {
      if (match.tagName === "All") {
        dispatch(setCurrentTag({ currentTag: "All", matches: allMatches }));
      } else {
        const filteredMatches = allMatches.filter((post : any) => post?.tagName === match.tagName);
        dispatch(setCurrentTag({ currentTag: match.tagName, matches: filteredMatches }));
      }

      setTimer(null);
    }, 1000);

    setTimer(newTimer);
  };

  const truncatedMessage =
    match?.message.length > 46 ? match.message.slice(0, 46) + "..." : match?.message;

  return (
    <div className="w-full min-h-36 flex gap-2 px-2 pb-2 col-span-12 lg:col-span-6" {...props}>
      <Link href={`/post/${match?.id}`} className="flex-1 block">
        <div className="w-[120px] h-[80px] md:w-[360px] lg:w-[160px] md:h-[150px] relative">
          <Img
            src={match?.media[0]?.url || ""}
            fill
            alt=""
            className="rounded-xl object-cover w-full h-full"
          />
        </div>
      </Link>
      <div className="flex-1 flex flex-col lg:-ml-12 xl:-ml-0">
        <Link href={`/post/${match?.id}`} className="font-bold lg:text-base md:text-xl block">
          {truncatedMessage}
        </Link>
        <button
          onClick={handleTagClick}
          className="text-sm text-mainGreen mt-3 mb-2 font-semibold cursor-pointer hover:underline"
        >
          #{match?.tagName}
        </button>
        <span className="text-gray-600 text-xs">
          {new Date(match?.date).toDateString() || "No date"}
        </span>
      </div>
    </div>
  );
};

export default NewsBanner;
