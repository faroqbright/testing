import { useEffect, useState } from "react";

export const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);
  return { currentUrl };
};
