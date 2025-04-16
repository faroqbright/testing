import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";
import Link from "next/link";

interface LogoProps extends HTMLAttributes<HTMLAnchorElement> {}

const Logo: React.FC<LogoProps> = async ({ ...props }) => {
  return (
    <Link href={"/"} className="flex place-items-center h-full gap-1" {...props}>
      <div className="relative h-12 w-12">
        <Img src={"/assets/imgs/icons/common.png"} alt="logo" fill />
      </div>
      <div className="relative w-20 h-full">
        <Img src={"/assets/imgs/icons/cricap.png"} alt="logo" fill objectFit="contain" />
      </div>
    </Link>
  );
};
export default Logo;
