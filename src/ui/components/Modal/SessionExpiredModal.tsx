import type { HTMLAttributes } from "react";
import React from "react";
import { ModalData } from "./types";
import ModalHeader from "./ModalHeader";
import AuthModalWrapper from "../auth/AuthModalWrapper";
import LinkButton from "@/ui/atoms/Button/LinkButton";
import Img from "../Img/Img";

interface SessionExpiredModalProps extends HTMLAttributes<HTMLDivElement> {
  modalData?: ModalData;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ modalData, ...props }) => {
  return (
    <AuthModalWrapper {...props}>
      <ModalHeader modalData={modalData} />
      <div className="w-full h-full flex justify-center place-items-center">
        <div className="flex flex-col gap-3 justify-center place-items-center">
          <Img src={"/assets/imgs/icons/danger.svg"} height={150} width={150} alt="danger" />
          <p className="text-center font-semibold">Your Session has been Expired, Please Login Again</p>
          <LinkButton href={"/?intercept=login"}>Login Again</LinkButton>
        </div>
      </div>
    </AuthModalWrapper>
  );
};
export default SessionExpiredModal;
