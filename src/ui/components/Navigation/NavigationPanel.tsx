"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import NavigationPanelItem from "./NavigationPanelItem";

interface NavigationPanelProps extends HTMLAttributes<HTMLDivElement> {}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ ...props }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const auth = localStorage.getItem("auth");
  //   setIsAuthenticated(!!auth);
  // }, []);

  return (
    <nav
      className="w-full h-[90px] md:h-auto bg-white text-black flex place-items-center justify-evenly md:justify-normal gap-4 p-2 rounded-t-xl md:rounded-none shadow-lg border border-gray-300 md:shadow-none"
      {...props}
    >
      <NavigationPanelItem title="Home" to="/" iconSrc="/assets/imgs/icons/home.svg" />
      <NavigationPanelItem
        title="Matches"
        to="/matches"
        queries={[{ key: "type", value: "live" }]}
        iconSrc="/assets/imgs/icons/match.png"
      />
      {/* {isAuthenticated && ( */}
        <NavigationPanelItem title="Trends" to="/trends" iconSrc="/assets/imgs/icons/trend.png" />
      {/* )} */}
      <NavigationPanelItem title="Series" to="/series" iconSrc="/assets/imgs/icons/vs.png" />
    </nav>
  );
};

export default NavigationPanel;
