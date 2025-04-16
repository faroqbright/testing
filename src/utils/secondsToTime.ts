import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import localizeFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(localizeFormat);

export const convertSecondsToDateTime = (seconds: number) => {
  const date = dayjs.unix(seconds);
  return date.format("LLL");
};
