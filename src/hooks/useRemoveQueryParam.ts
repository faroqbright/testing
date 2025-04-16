"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useRemoveQueryParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeParam = (param: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete(param);
    router.replace(`${pathname}?${nextSearchParams}`);
  };
  return { removeParam };
};
