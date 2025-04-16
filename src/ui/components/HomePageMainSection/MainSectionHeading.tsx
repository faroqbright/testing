import type { HTMLAttributes } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";

interface MainSectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const MainSectionHeading: React.FC<MainSectionHeadingProps> = ({ title, className, ...props }) => {
  return (
    <h2 className={twMerge(["text-xl font-bold", className])} {...props}>
      {title}
    </h2>
  );
};
export default MainSectionHeading;
