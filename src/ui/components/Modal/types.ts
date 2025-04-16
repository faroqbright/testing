import { FC, ReactNode } from "react";
import { modalsData } from "./modal.data";

export interface ModalData {
  name: string;
  title: string;
  component: FC<{ modalData?: ModalData }>;
}

type ExtractModalNames<T extends readonly { name: string }[]> = T[number]["name"];

export type ModalNames = ExtractModalNames<typeof modalsData>;
