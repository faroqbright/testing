"use client";
import { useAuth } from "@/hooks/useAuth";
import type { HTMLAttributes } from "react";
import React, { Suspense } from "react";
import Img from "../Img/Img";
import useHandleModal from "@/hooks/useHandleModal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

interface AuthNavProps extends HTMLAttributes<HTMLDivElement> {}

const AuthNav: React.FC<AuthNavProps> = ({ ...props }) => {
  const router = useRouter();
  const { isLogin } = useAuth();
  const path = usePathname();
  const { openModal } = useHandleModal({ modal: "login" });

  const handleModal = () => {
    openModal();
  };

  const handleLogOut = () => {
    window.localStorage.setItem("auth", "");
    window.location.assign("/");
  };

  return (
    <Suspense>
      <div {...props} className="flex place-items-center gap-3">
        <button onClick={handleModal} className={`text-white ${isLogin ? "hidden" : ""}`}>
          <Img src={"/assets/imgs/icons/user.png"} height={25} width={25} alt="" />
        </button>
        <nav className={`${!isLogin ? "hidden" : path === "/profile" ? "hidden" : ""}`}>
          <Link href={"/profile"}>
            <Img src={"/assets/imgs/icons/user.png"} height={25} width={25} alt="" />
          </Link>
        </nav>

        <nav className={`${path === "/profile" ? "" : "hidden"}`}>
          <button onClick={handleLogOut}>
            <Img src={"/assets/imgs/icons/logout.svg"} height={25} width={25} alt="" />
          </button>
        </nav>
      </div>
    </Suspense>
  );
};
export default dynamic(() => Promise.resolve(AuthNav), { ssr: false });
