import type { HTMLAttributes, ReactNode } from "react";
import React from "react";

interface SeriesSectionWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const SeriesSectionWrapper: React.FC<SeriesSectionWrapperProps> = ({ children, ...props }) => {
  return (
    <div className="bg-mainBg h-fit w-full" {...props}>
      {children}
    </div>
  );
};
export default SeriesSectionWrapper;
