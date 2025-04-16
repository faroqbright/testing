export const convertToLocalTime = (status: string): string => {
  const dateMatch = status.match(/([A-Za-z]+,? \w{3} \d{1,2})/);
  const timeMatch = status.match(/(\d{1,2}:\d{2} [APM]{2})/);

  if (dateMatch && timeMatch) {
    const dateString = dateMatch[0];
    const timeString = timeMatch[0];

    let parsedDate = new Date(dateString + " " + new Date().getFullYear());

    if (isNaN(parsedDate.getTime())) {
      return status;
    }

    parsedDate.setDate(parsedDate.getDate() + 1);

    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    parsedDate.setUTCHours(hours, minutes, 0, 0);

    const localDate = new Date(parsedDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateLabel;
    if (localDate.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (localDate.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = localDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }

    return `${dateLabel} • ${localDate.toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  }

  return status;
};
