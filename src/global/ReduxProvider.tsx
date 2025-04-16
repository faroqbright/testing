"use client";
import type { HTMLAttributes, ReactNode } from "react";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

interface ReduxProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children, ...props }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxProvider;
