import Heading from "@/ui/atoms/heading/Heading";
import type { HTMLAttributes } from "react";
import React from "react";
import TagsCarousal from "./TagsCarousal";

interface TrendsProps extends HTMLAttributes<HTMLDivElement> {
  tagsData: any[];
}

const Trends: React.FC<TrendsProps> = ({ tagsData, ...props }) => {
  return (
    <div className="md:hidden" {...props}>
      <Heading title="trends" />
      <TagsCarousal tagsData={tagsData} />
    </div>
  );
};
export default Trends;
