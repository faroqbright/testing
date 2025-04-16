import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Function to get current time with user's timezone from Unix timestamp
export function getCurrentTimeWithTimezone(unixSeconds: number): string {
  // Convert Unix timestamp to milliseconds
  const unixMilliseconds = unixSeconds * 1000;

  // Get current time in UTC from Unix timestamp
  const currentTime = dayjs(unixMilliseconds);

  // Get user's current timezone
  const userTimezone = dayjs.tz.guess();

  // Format the date and time according to the user's timezone
  const formattedDateTime = currentTime.tz(userTimezone).format("YYYY-MM-DD HH:mm:ss");

  // Construct the output string
  const output = `${formattedDateTime} according to ${userTimezone} Timezone`;

  return output;
}
