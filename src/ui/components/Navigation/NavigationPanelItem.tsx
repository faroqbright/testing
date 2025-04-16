"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Img from "../Img/Img";
import { HTMLAttributes } from "react";
import dynamic from "next/dynamic";

interface NavigationPanelItemProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
  to: string;
  iconSrc: string;
  queries?: { key: string; value: string }[];
}

const NavigationPanelItem: React.FC<NavigationPanelItemProps> = ({ title, to, iconSrc, queries, ...props }) => {
  const queryString = new URLSearchParams();
  if (queries) {
    queries.forEach((query) => {
      queryString.set(query.key, query.value);
    });
  }
  const path = usePathname();
  const active = path === to;

  return (
    <Link
      role={title}
      href={`${to}?${queryString}`}
      className={`uppercase border-mainGreen py-1 font-light md:font-bold flex justify-center place-items-center flex-col text-sm ${
        active ? "border-b-[3px] text-mainGreen" : ""
      }`}
    >
      <Img src={iconSrc} height={20} width={20} alt={title} className="md:hidden pb-1" />
      <span className="text-xs">{title}</span>
    </Link>
  );
};

export default dynamic(() => Promise.resolve(NavigationPanelItem), { ssr: false });
