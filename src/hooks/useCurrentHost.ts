export const useCurrentHost = () => {
  if (typeof window === "undefined") {
    return;
  }
  const isLocalHost = window.location.host.startsWith("local");
  const currentHost = isLocalHost ? `${window.location.host}` : window.location.hostname;

  return currentHost;
};
