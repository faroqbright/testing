"use client";
import { useQueryState } from "nuqs";
import type { HTMLAttributes, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Toaster } from "sonner";
import ReduxProvider from "@/global/ReduxProvider";
import dynamic from "next/dynamic";

interface MainWrapperProps extends HTMLAttributes<HTMLBodyElement> {
  children: ReactNode;
}

const MainWrapper: React.FC<MainWrapperProps> = ({ children, className, ...props }) => {
  const [modalQuery] = useQueryState("intercept");
  const isModalOpen = modalQuery ? true : false;

  return (
    <main
      className={twMerge(
        className,
        isModalOpen ? "overflow-hidden" : "",
        "bg-mainBg h-full flex flex-col justify-between relative"
      )}
      {...props}
    >
      <ReduxProvider>
        <Toaster />
        {children}
      </ReduxProvider>
    </main>
  );
};
export default dynamic(() => Promise.resolve(MainWrapper), { ssr: false });
