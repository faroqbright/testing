/* eslint-disable react/no-unescaped-entities */
import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";

interface MatchNotFoundProps extends HTMLAttributes<HTMLDivElement> {
  errorCode?: number;
}

const MatchNotFound: React.FC<MatchNotFoundProps> = ({ ...props }) => {
  return (
    <div className="flex justify-center place-items-center min-h-[30vw] flex-col p-3 text-center capitalize gap-2">
      <Img src={"/assets/imgs/icons/match-not-found.svg"} alt="Server Error" height={200} width={200} />
      <div className="flex flex-col">
        <p>
          <span className="font-bold">Match Not Found</span>
          <br /> Sorry, we couldn't find the cricket match you were looking for. It might be that the match details are
          not available at the moment or the match has been postponed or canceled. Please check back later or try
          searching for a different match. We apologize for any inconvenience
          <br /> please try again later <br />
        </p>
        {props.errorCode ? (
          <p className="text-red-500">
            Error Code: <span className="font-bold">{props.errorCode}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
};
export default MatchNotFound;
