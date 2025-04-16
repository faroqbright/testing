import Link, { LinkProps } from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import React from "react";

interface LinkButtonProps extends LinkProps {
  children: ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({ children, ...props }) => {
  return (
    <Link {...props} className="bg-mainGreen px-2 md:px-3 py-1 md:py-2 text-center rounded-full text-white">
      {children}
    </Link>
  );
};
export default LinkButton;
