import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export interface TabsData {
  title: string;
  query: string;
}

interface MakeTabsProps extends HTMLAttributes<HTMLDivElement> {
  tabsData: TabsData[];
  tabName: string;
  tabsType: "primary" | "secondary";
}

const MakeTabs: React.FC<MakeTabsProps> = ({ tabsData, tabName, tabsType, ...props }) => {
  const [currentTab, setCurrentTab] = useQueryState(tabName);

  const [emblaRef] = useEmblaCarousel({ dragFree: true });

  useEffect(() => {
    if (!currentTab) {
      setCurrentTab(tabsData[0].query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, tabsData]);

  return tabsType === "primary" ? (
    <div
      className="bg-white px-3 py-2 flex place-items-center gap-3 overflow-hidden select-none"
      ref={emblaRef}
      {...props}
    >
      {tabsData.map((tab) => {
        return (
          <button
            key={tab.title}
            className={`uppercase border-mainGreen py-1 font-light md:font-bold flex justify-center place-items-center flex-col text-base text-nowrap ${
              currentTab === tab.query ? "border-b-[3px] text-mainGreen" : ""
            }`}
            onClick={() => setCurrentTab(tab.query)}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  ) : (
    <div className="bg-mainGreen p-4 flex place-items-center gap-3 overflow-hidden" ref={emblaRef}>
      <div className="flex place-items-center w-full gap-2">
        {tabsData.map((tab) => {
          return (
            <button
              className={`text-nowrap ${
                currentTab === tab?.query.toLowerCase() ? "bg-white text-black rounded-full" : "text-white"
              } py-1 px-2 font-bold `}
              key={tab?.query}
              onClick={() => setCurrentTab(tab?.query?.toLowerCase())}
            >
              {tab?.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default MakeTabs;
