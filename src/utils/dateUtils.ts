export const formatTime = (time: string): string => {
  return time;
};

export const formatDateTime = (date: Date, locale = 'ja'): string => {
  if (locale === 'ja') {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric', 
      day: 'numeric',
      weekday: 'short'
    }) + ' ' + date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric', 
    weekday: 'short'
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const createTimeSlotFromString = (
  baseDate: Date, 
  timeString: string, 
  incrementMinutes: number, 
  slotIndex: number
): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  result.setMinutes(result.getMinutes() + (incrementMinutes * slotIndex));
  return result;
};