"use client";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { use } from "react";
import { modalsData } from "./modal.data";
import dynamic from "next/dynamic";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {}

const Modal: React.FC<ModalProps> = ({ ...props }) => {
  const [modalQuery, setModalQuery] = useQueryState("intercept");

  const currentModalData = modalsData.find((data) => data.name === modalQuery);

  const content = modalsData.map((data) => {
    switch (modalQuery) {
      case data.name:
        return <data.component modalData={data} />;

      default:
        break;
    }
  });

  console.log(modalQuery);

  return (
    <div
      className={`backdrop-blur-sm w-full absolute justify-center place-items-center z-50 md:py-2 h-full overflow-auto ${
        modalQuery ? "flex" : "hidden"
      }`}
    >
      {content}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Modal), { ssr: false });
