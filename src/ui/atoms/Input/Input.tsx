import type { ForwardRefRenderFunction, HTMLAttributes, InputHTMLAttributes } from "react";
import React from "react";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { ZodError } from "zod";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ error, ...props }, ref) => {
  return (
    <div>
      <input
        ref={ref}
        className="rounded-md px-2 md:px-3 py-1 md:py-2 w-full border border-mainGreen outline-mainGreen"
        {...props}
      />
      {error?.message ? <span className="text-red-500">{error.message}</span> : ""}
    </div>
  );
};
export default forwardRef(Input);
