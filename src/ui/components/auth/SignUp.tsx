"use client";
import type { HTMLAttributes } from "react";
import React, { Suspense, useCallback, useState } from "react";
import { ModalData } from "../Modal/types";
import Button from "@/ui/atoms/Button/Button";
import Input from "@/ui/atoms/Input/Input";
import ModalHeader from "../Modal/ModalHeader";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterAPI } from "@/api/methods/auth";
import { useRouter } from "next/navigation";
import AuthModalWrapper from "./AuthModalWrapper";
import useHandleModal from "@/hooks/useHandleModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpValidationSchema } from "../../../validations/signup.validation";
import { toast } from "sonner";
import Img from "../Img/Img";
import Cookies from "js-cookie";

interface SignUpProps extends HTMLAttributes<HTMLDivElement> {
  modalData?: ModalData;
}

type SignUpInputs = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

const SignUp: React.FC<SignUpProps> = ({ modalData, ...props }) => {
  const router = useRouter();
  const { openModal } = useHandleModal({ modal: "login" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({
    defaultValues: { name: "", email: "", password: "", confirm_password: "" },
    resolver: zodResolver(signUpSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpInputs> = useCallback(async (data) => {
    try {
      setIsLoading(true);
      const response = await RegisterAPI({
        username: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("auth", JSON.stringify(response.data));
      Cookies.set("auth", JSON.stringify(response.data));
      window.location.assign("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to SignUp", {
        position: "top-right",
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginModal = () => {
    openModal();
  };

  return (
    <AuthModalWrapper className="flex flex-col gap-3" {...props}>
      <Suspense>
        <ModalHeader modalData={modalData} />
      </Suspense>
      <div {...props} className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
      </div>
      <form
        className="w-full md:w-[80%] mx-auto h-full py-2 flex place-items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2 justify-start w-full">
          <Input placeholder="Name" type="text" {...register("name")} error={errors.name} />
          <Input placeholder="Email" type="email" {...register("email")} error={errors.email} />
          <Input placeholder="Password" type="password" {...register("password")} error={errors.password} />
          <Input
            placeholder="Confirm Password"
            type="password"
            {...register("confirm_password")}
            error={errors.confirm_password}
          />
          <div className="flex items-center gap-2">
            <Input placeholder="Confirm Password" type="checkbox" />
            <label className="text-[#ABABAB]">
              By signing up you accept the <span className="text-[#0080FF] cursor-pointer">Term of services </span> and
              <span className="text-[#0080FF] cursor-pointer"> Privacy Policy</span>
            </label>
          </div>

          <Button isLoading={isLoading}>Sign Up</Button>
          <button onClick={handleLoginModal} className="text-sm md:text-base text-[#ABABAB]">
            Already have an account?<span className="font-bold text-[#0080FF]"> Login Here</span>
          </button>
        </div>
      </form>
    </AuthModalWrapper>
  );
};
export default SignUp;
