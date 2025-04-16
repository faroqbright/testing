export const convertToLocalDate = (status: string): string => {
  const timeMatch = status.match(/(\d{1,2}:\d{2} [APM]{2})/);

  if (timeMatch) {
    const utcTime = timeMatch[0];
    const nowUTC = new Date();
    const isTomorrow = status.includes("Tomorrow");

    let utcDate = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate()));

    if (isTomorrow) {
      utcDate.setUTCDate(utcDate.getUTCDate() + 1);
    }

    const [time, period] = utcTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    utcDate.setUTCHours(hours, minutes, 0, 0);

    const localDate = new Date(utcDate);

    return localDate.toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  return status;
};
