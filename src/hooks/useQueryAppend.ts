import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useQueryAppend = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      return params.toString();
    },
    [searchParams]
  );

  const pushParam = useCallback(
    (key: string, value: string) => {
      router.push(`${pathName}?${createQueryString(key, value)}`);
    },
    [createQueryString, pathName, router]
  );

  return { pushParam };
};
