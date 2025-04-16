"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import { ModalData } from "./types";
import useHandleModal from "@/hooks/useHandleModal";
import Img from "../Img/Img";
import { cn } from "@/utils/cn";

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  modalData?: ModalData;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ modalData, className, ...props }) => {
  const { closeModal } = useHandleModal({ modal: modalData?.name });
  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={cn("flex place-items-center justify-between  w-full ", className)} {...props}>
      <span className="text-xl md:text-2xl font-bold capitalize">{modalData?.name}</span>
      <button title="close" onClick={handleClose}>
        <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
      </button>
    </div>
  );
};
export default ModalHeader;
