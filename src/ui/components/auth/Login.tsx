"use client";
/* eslint-disable react/no-unescaped-entities */
import type { HTMLAttributes } from "react";
import React, { Suspense, useCallback, useState } from "react";
import { ModalData } from "../Modal/types";
import AuthModalWrapper from "./AuthModalWrapper";
import ModalHeader from "../Modal/ModalHeader";
import Input from "@/ui/atoms/Input/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/ui/atoms/Button/Button";
import { useRouter } from "next/navigation";
import useHandleModal from "@/hooks/useHandleModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/login.validation";
import { toast } from "sonner";
import Img from "../Img/Img";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "@/api/config";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const googleAuth = () => {
  window.location.href = `https://ws.cricap.com/api/connect/google`;
};

const facebookAuth = () => {
  window.location.href = `https://backend.stage.cricap.com/api/connect/facebook`;
};

interface LoginProps extends HTMLAttributes<HTMLDivElement> {
  modalData?: ModalData;
}

type LoginInputs = {
  identifier: string;
  password: string;
};

const Login: React.FC<LoginProps> = ({ modalData, ...props }) => {
  const router = useRouter();
  const { openModal } = useHandleModal({ modal: "signup" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });

  const [isLoading, setIsLoading] = useState(false);
  

  const onSubmit: SubmitHandler<LoginInputs> = useCallback(
    async (data) => {
      try {
        setIsLoading(true);

        const response = await axios.post(`${BASE_URL}/auth/local`, {
          identifier: data.identifier,
          password: data.password,
        });

        localStorage.setItem("auth", JSON.stringify(response.data));
        Cookies.set("auth", JSON.stringify(response.data));
        window.location.assign("/");
        router.push("/", {});
      } catch (error: any) {
        toast.error(error?.response?.data?.error?.message || "Failed to Login", {
          position: "top-right",
          closeButton: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const handleSignUpModalOpen = () => {
    openModal();
  };

  return (
    <AuthModalWrapper className="flex flex-col gap-3 justify-between" {...props}>
      <Suspense>
        <ModalHeader modalData={modalData} />
      </Suspense>
      <div className="flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
      </div>
      <form
        className="w-full md:w-[80%] mx-auto  h-full py-2 flex place-items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2 justify-start w-full">
          <Input placeholder="Email or username" type="text" error={errors.identifier} {...register("identifier")} />
          <Input placeholder="Password" type="password" error={errors.password} {...register("password")} />
          <Button isLoading={isLoading}>Login</Button>
          <button
            type="button"
            onClick={googleAuth}
            className="bg-red-500 rounded-3xl text-white p-2 flex items-center gap-2 justify-center w-full"
          >
            <FaGoogle />
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={facebookAuth}
            className="bg-blue-500 rounded-3xl text-white p-2 flex items-center gap-2 justify-center w-full"
          >
            <FaFacebook />
            Sign in with Facebook
          </button>
          <button onClick={handleSignUpModalOpen} className="text-[#ABABAB]">
            If you don't have an account <span className="font-bold text-[#0080FF]">Sign Up</span>
          </button>
        </div>
      </form>
    </AuthModalWrapper>
  );
};
export default Login;
