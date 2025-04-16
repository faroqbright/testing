import type { HTMLAttributes } from 'react';
import React from 'react'
import Logo from './Logo';
import Navigation from "./Navigation";
import NavigationIcon from "./NavigationIcon";
import AuthNav from "./AuthNav";

interface MainHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const MainHeader: React.FC<MainHeaderProps> = ({ ...props }) => {
  return (
    <header className="bg-mainGreen w-full p-[10px] flex justify-between place-items-center max-h-[60px] h-[60px]">
      <Logo />
      <div className="flex place-items-center gap-4">
        <Navigation />
        <NavigationIcon src="/assets/imgs/icons/search.png" title="search" modal="" />
        <AuthNav />
      </div>
    </header>
  );
};
export default MainHeader