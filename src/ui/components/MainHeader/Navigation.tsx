"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";
import { useCurrentUrl } from "@/hooks/useCurrentUrl";

interface NavigationProps extends HTMLAttributes<HTMLDivElement> {
  invertedIcons?: boolean;
  hiddenOnSm?: boolean;
  postTitle?: string;
}

const Navigation: React.FC<NavigationProps> = ({ invertedIcons = true, hiddenOnSm = true, postTitle, ...props }) => {
  return (
    <div className="flex justify-between place-items-center gap-4" {...props}>
      <NavItem
        src="/assets/imgs/icons/twitterShare.png"
        title="Tweet"
        platform="twitter"
        invert={invertedIcons}
        hiddenOnSm={hiddenOnSm}
        postTitle={postTitle}
      />
      <NavItem
        src="/assets/imgs/icons/social.png"
        title="Share"
        platform="facebook"
        invert={invertedIcons}
        hiddenOnSm={hiddenOnSm}
        postTitle={postTitle}
      />
      <NavItem
        src="/assets/imgs/icons/link.png"
        title="Copy URL"
        platform="copy"
        invert={invertedIcons}
        hiddenOnSm={hiddenOnSm}
        postTitle={postTitle}
      />
    </div>
  );
};
export default Navigation;

interface NavItemProps {
  src: string;
  title: string;
  platform: string;
  invert?: boolean;
  hiddenOnSm?: boolean;
  postTitle?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  src,
  title,
  platform,
  invert = true,
  postTitle,
  hiddenOnSm = true,
}) => {
  const router = useCurrentUrl();

  const handleClick = (platform: string) => {
    const url = router.currentUrl || "";
    const facebookLink = `https://www.facebook.com/dialog/share?app_id=1139912210574422&display=page&href=${url}`;
    const heading = encodeURIComponent(postTitle || "");
    const twitterPostUrl = encodeURIComponent(url);
    const twitterUrl = `https://x.com/intent/post?lang=en&url=${twitterPostUrl}&text=${heading}`;

    switch (platform) {
      case "twitter":
        window.open(twitterUrl);
        break;
      case "facebook":
        window.open(facebookLink);
        break;
      case "copy":
        window.navigator.clipboard.writeText(url);
        alert("URL copied to clipboard");
        break;
      default:
        break;
    }
  };
  return (
    <button
      className={`md:flex justify-center place-items-center gap-1 text-white text-[14px] ${hiddenOnSm ? "hidden" : ""}`}
      onClick={() => handleClick(platform)}
    >
      <Img src={src} alt={title} width={20} height={20} className={`${invert ? "invert" : "text-black"}`} />
      <span title={title} className={`${invert ? "" : "text-black"} hidden md:block`}>
        {title}
      </span>
    </button>
  );
};
