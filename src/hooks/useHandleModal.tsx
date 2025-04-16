import { ModalNames } from "@/ui/components/Modal/types";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { useCallback } from "react";
import { useRemoveQueryParam } from "./useRemoveQueryParam";

type UseHandleModal = ({ modal }: { modal?: ModalNames }) => UseHandleModalReturn;

interface UseHandleModalReturn {
  openModal: () => void;
  closeModal: () => void;
}

const useHandleModal: UseHandleModal = ({ modal }) => {
  const [_currentModalQuery, setModalQuery] = useQueryState("intercept");
  const { removeParam } = useRemoveQueryParam();

  const openModal = useCallback(() => {
    setModalQuery(modal || "");
  }, [modal, setModalQuery]);

  const closeModal = useCallback(() => {
    removeParam("intercept");
  }, [removeParam]);

  return { openModal, closeModal };
};
export default useHandleModal;
