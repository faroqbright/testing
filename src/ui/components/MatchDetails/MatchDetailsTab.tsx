import type { HTMLAttributes } from "react";
import React, { use } from "react";
import { matchDetailsTabData } from "./matchDetailsTab.data";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import useEmblaCarousel from "embla-carousel-react";

interface MatchDetailsTabProps extends HTMLAttributes<HTMLDivElement> {
  matchType?: string;
}

const MatchDetailsTab: React.FC<MatchDetailsTabProps> = ({ ...props }) => {
  const [_tabQuery, setTabQuery] = useQueryState("tab", { scroll: false });
  const [_inningQuery, setInningQuery] = useQueryState("inning", { scroll: false });

  const [emblaRef] = useEmblaCarousel();

  const currentTab = useSearchParams().get("tab");
  const handleTabActivation = (tab: string) => {
    setTabQuery(tab);
    if (tab === "scorecard") {
      setInningQuery("first_inning");
    }
  };
  return (
    <div className="overflow-hidden py-4 md:mx-2 w-full select-none px-2" ref={emblaRef}>
      <div className="flex place-items-center justify-between md:justify-evenly w-full gap-2">
        {matchDetailsTabData.map((tab) => {
          return (
            <button
              className={`py-1 px-3 rounded-2xl text-nowrap  ${
                tab.name === currentTab ? "bg-mainGreen text-white" : "bg-white text-mainGreen"
              }`}
              key={tab.name}
              onClick={() => handleTabActivation(tab.name)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default MatchDetailsTab;
