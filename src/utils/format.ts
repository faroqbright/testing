export const formatBatsmanName = (fullName: string): string => {
  if (!fullName) return "";
  const nameParts = fullName.split(" ");
  if (nameParts.length > 1) {
    return `${nameParts[0].charAt(0)}. ${nameParts.slice(1).join(" ")}`;
  }
  return fullName;
};
