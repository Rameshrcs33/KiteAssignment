export const parseTimeString = (
  timeString: string,
): { hours: number; minutes: number } => {
  let hours = parseInt(timeString.split(":")[0]);
  let minutes = parseInt(timeString.split(":")[1]);

  if (timeString.includes("PM") && hours !== 12) {
    hours += 12;
  } else if (timeString.includes("AM") && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

export const getEventDateTime = (
  startDate: string,
  startTime: string,
): Date => {
  const [year, month, day] = startDate.split("-").map(Number);
  const { hours, minutes } = parseTimeString(startTime);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

export const isEventExpired = (
  startDate: string,
  startTime: string,
): boolean => {
  const now = new Date();
  const eventDateTime = getEventDateTime(startDate, startTime);
  return now > eventDateTime;
};

export const isEventStarted = (
  startDate: string,
  startTime: string,
): boolean => {
  const now = new Date();
  const eventDateTime = getEventDateTime(startDate, startTime);
  return now >= eventDateTime;
};
