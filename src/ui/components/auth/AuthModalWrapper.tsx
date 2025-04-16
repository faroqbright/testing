"use client";
import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";
import React from "react";

interface AuthModalWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AuthModalWrapper: React.FC<AuthModalWrapperProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("bg-white w-[90%] md:h-[90%] h-fit rounded-xl px-5 md:px-3 py-5 overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  );
};
export default AuthModalWrapper;
