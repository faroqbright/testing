import type { HTMLAttributes } from "react";
import React from "react";
import { EmblaCarouselType } from "embla-carousel";
import Img from "../Img/Img";

interface CarousalButtonProps extends HTMLAttributes<HTMLDivElement> {
  emblaApi: EmblaCarouselType | undefined;
  type: "next" | "prev";
}

const CarousalButton: React.FC<CarousalButtonProps> = ({ emblaApi, type, ...props }) => {
  const handleSlide = () => {
    if (emblaApi) {
      if (type === "next") {
        emblaApi?.scrollNext();
      } else if (type === "prev") {
        emblaApi.scrollPrev();
      } else {
      }
    }
  };

  return (
    <div className={`${type === "prev" ? "left-0" : "right-0"} hidden md:block`} {...props}>
      <button onClick={handleSlide}>
        {type === "prev" ? (
          <Img
            src={"/assets/imgs/icons/left.png"}
            alt="prev"
            width={45}
            height={45}
            className="bg-white rounded-full p-1"
          />
        ) : (
          <Img
            src={"/assets/imgs/icons/right.png"}
            alt="prev"
            width={45}
            height={45}
            className="bg-white rounded-full p-1"
          />
        )}
      </button>
    </div>
  );
};
export default CarousalButton;
