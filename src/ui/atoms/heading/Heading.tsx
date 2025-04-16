import type { HTMLAttributes } from "react";
import React from "react";

interface HeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const Heading: React.FC<HeadingProps> = ({ title, ...props }) => {
  return (
    <div className="w-full flex place-items-center md:hidden" {...props}>
      <span className="capitalize font-bold mr-1">{title}</span>
      <span className="h-[1px] bg-black opacity-50 w-full" />
    </div>
  );
};
export default Heading;
