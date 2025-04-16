import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";

interface ServerErrorProps extends HTMLAttributes<HTMLDivElement> {
  errorCode?: number;
}

const ServerError: React.FC<ServerErrorProps> = ({ ...props }) => {
  return (
    <div className="flex justify-center place-items-center min-h-[30vw] flex-col md:flex-row p-3 text-center capitalize">
      <Img src={"/assets/imgs/icons/server-error.svg"} alt="Server Error" height={300} width={300} />
      <div className="flex flex-col">
        <p>
          <span className="font-bold">Oops! Something went wrong </span>
          <br /> Or maybe the page you are looking for is not availaible right now <br /> please try again later <br />
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
export default ServerError;
