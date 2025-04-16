"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import MatchCard from "./MatchCard";
import CarousalButton from "./CarousalButton";
import Heading from "@/ui/atoms/heading/Heading";
import { Match } from "@/@types/matches";

interface MatchesCarousalProps {
  matchesData: Match[];
}

const MatchesCarousal: React.FC<MatchesCarousalProps> = ({ matchesData, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  return (
    <div className="flex flex-col">
      <Heading title="matches" />
      <div className="flex place-items-center relative" {...props}>
        <CarousalButton emblaApi={emblaApi} type="prev" />
        <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
          <div className="flex place-items-center gap-2">
            {matchesData?.map((match) => (
              <div
                key={match.matchId}
                className="
                  flex-[0_0_calc(100%-1rem)] 
                  md:flex-[0_0_calc(33.33%-0.5rem)] 
                  lg:flex-[0_0_calc(25%-0.5rem)] 
                  2xl:flex-[0_0_calc(20%-0.5rem)]
                  px-1
                "
              >
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        </div>
        <CarousalButton emblaApi={emblaApi} type="next" />
      </div>
    </div>
  );
};

export default MatchesCarousal;
