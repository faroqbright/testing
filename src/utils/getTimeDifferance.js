export const getTimeDifference = (date) => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  const timeDifference = currentDate - givenDate;

  const minutes = Math.floor(timeDifference / 60000);
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));

  if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (days === 1) {
    return '1 day ago';
  } else if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (months === 1) {
    return '1 month ago';
  } else if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return `${givenDate.getFullYear()}-${givenDate.getMonth() + 1}-${givenDate.getDate()}`;
  }
};
