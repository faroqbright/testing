"use client";
import { useDetectScroll } from "@/hooks/useDetectScroll";
import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";
import React from "react";

interface FixedProps extends HTMLAttributes<HTMLDivElement> {
  as: "aside" | "div" | "span" | "article" | "header";
}

export const Fixed: React.FC<FixedProps> = ({ className, children, ...props }) => {
  const { collide } = useDetectScroll({ height: 100 });
  console.log(collide);

  return (
    <props.as className={cn(className, collide ? "sticky top-1 " : "")} {...props}>
      {children}
    </props.as>
  );
};
