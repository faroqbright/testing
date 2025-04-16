import Img from "@/ui/components/Img/Img";
import type { HTMLAttributes, ReactNode } from "react";
import React from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-mainGreen px-2 md:px-3 py-1 md:py-2 text-center rounded-full text-white flex place-items-center justify-center gap-2"
    >
      {children}
      {props.isLoading ? (
        <Img src={"/assets/imgs/icons/spinner.svg"} height={15} width={15} className="animate-spin" alt="" />
      ) : null}
    </button>
  );
};
export default Button;
