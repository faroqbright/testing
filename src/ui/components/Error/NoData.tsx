import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";

interface NoDataProps extends HTMLAttributes<HTMLDivElement> {}

const NoData: React.FC<NoDataProps> = ({ ...props }) => {
  return (
    <div className="flex justify-center place-items-center min-h-[30vw] flex-col md:flex-row p-3 text-center">
      <Img src={"/assets/imgs/icons/nothing.svg"} alt="Server Error" height={300} width={300} />
      <p>
        Currently we found nothing for you right now! <br /> Please visit this Page/Section later or try again for
        latest updates
      </p>
    </div>
  );
};
export default NoData;
