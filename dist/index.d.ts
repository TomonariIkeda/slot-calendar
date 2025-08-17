declare enum SlotStatus {
    UNAVAILABLE = "unavailable",
    AVAILABLE = "available",
    RESERVED = "reserved"
}
interface TimeSlot {
    staffId?: number;
    status: SlotStatus;
    startTime: Date;
    endTime: Date;
}
interface CalendarDay {
    year: number;
    month: number;
    day: number;
    weekday: string;
    slots: TimeSlot[];
}
interface CalendarData {
    year: number;
    month: number;
    day: number;
    firstSlotStartAt: string;
    availabilityIncrements: number;
    hasPrev: boolean;
    hasNext: boolean;
    days: CalendarDay[];
    syncTokens?: Array<{
        staffId: number;
        syncToken: string;
    }>;
    syncToken?: string;
}
interface SlotCalendarProps {
    menuItemIds?: number[];
    staffId?: number;
    isStaffSelected?: boolean;
    shopId: number;
    reservationId?: number;
    initialDate?: Date;
    onSlotSelect?: (slotData: {
        startAt: string;
        staff: {
            id: number;
            nameDisplay: string;
        };
        syncToken: string;
    }) => void;
    onLoadingChange?: (isLoading: boolean) => void;
    className?: string;
    disabled?: boolean;
}
interface BusinessHours {
    openTime: string;
    closeTime: string;
    availabilityIncrements: number;
}
interface SlotCalendarState {
    currentDate: Date;
    calendarData: CalendarData | null;
    isLoading: boolean;
    error: string | null;
}

export { SlotStatus };
export type { BusinessHours, CalendarData, CalendarDay, SlotCalendarProps, SlotCalendarState, TimeSlot };
