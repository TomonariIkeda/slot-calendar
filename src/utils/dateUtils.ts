export const formatTime = (date: Date, locale = 'en-US'): string => {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDate = (date: Date, locale = 'en-US'): string => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const startOfWeek = (date: Date, weekStartsOn = 0): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getWeekDays = (date: Date, weekStartsOn = 0): Date[] => {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const createTimeSlot = (date: Date, startTime: string, duration: number): { start: Date; end: Date } => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + duration);
  
  return { start, end };
};

export const isTimeInBusinessHours = (time: Date, businessHours: { startTime: string; endTime: string }[]): boolean => {
  const dayOfWeek = time.getDay();
  const timeString = formatTime(time);
  
  return businessHours.some(hours => {
    return timeString >= hours.startTime && timeString <= hours.endTime;
  });
};