export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  reserved?: boolean;
  metadata?: Record<string, any>;
}

export interface CalendarDay {
  date: Date;
  slots: TimeSlot[];
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface BusinessHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface ReservationCalendarProps {
  startDate?: Date;
  endDate?: Date;
  businessHours?: BusinessHours[];
  slotDuration?: number; // in minutes
  availableSlots?: TimeSlot[];
  selectedSlots?: string[];
  onSlotSelect?: (slot: TimeSlot) => void;
  onSlotDeselect?: (slot: TimeSlot) => void;
  onDateChange?: (date: Date) => void;
  disabled?: boolean;
  minSelectableDate?: Date;
  maxSelectableDate?: Date;
  className?: string;
  locale?: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  selectedSlots: Set<string>;
}

export interface CalendarAction {
  type: 'SET_CURRENT_DATE' | 'SET_SELECTED_DATE' | 'TOGGLE_SLOT' | 'CLEAR_SELECTION';
  payload?: any;
}