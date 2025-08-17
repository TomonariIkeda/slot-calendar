export enum SlotStatus {
  UNAVAILABLE = 'unavailable',
  AVAILABLE = 'available', 
  RESERVED = 'reserved'
}

export interface TimeSlot {
  staffId?: number;
  status: SlotStatus;
  startTime: Date;
  endTime: Date;
}

export interface CalendarDay {
  year: number;
  month: number;
  day: number;
  weekday: string;
  slots: TimeSlot[];
}

export interface CalendarData {
  year: number;
  month: number;
  day: number;
  firstSlotStartAt: string; // HH:mm format
  availabilityIncrements: number; // minutes
  hasPrev: boolean;
  hasNext: boolean;
  days: CalendarDay[];
  syncTokens?: Array<{ staffId: number; syncToken: string }>;
  syncToken?: string;
}

export interface SlotCalendarProps {
  menuItemIds?: number[];
  staffId?: number;
  isStaffSelected?: boolean;
  shopId: number;
  reservationId?: number;
  initialDate?: Date;
  onSlotSelect?: (slotData: {
    startAt: string;
    staff: { id: number; nameDisplay: string };
    syncToken: string;
  }) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export interface BusinessHours {
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  availabilityIncrements: number; // minutes
}

export interface SlotCalendarState {
  currentDate: Date;
  calendarData: CalendarData | null;
  isLoading: boolean;
  error: string | null;
}