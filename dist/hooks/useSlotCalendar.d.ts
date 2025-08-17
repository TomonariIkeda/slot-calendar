import { CalendarData } from '../types';
export declare const useSlotCalendar: (initialDate?: Date, onLoadingChange?: (isLoading: boolean) => void) => {
    loadSlots: (menuItemIds: number[], staffId: number | undefined, isStaffSelected: boolean, shopId: number, reservationId?: number) => Promise<void>;
    navigateToPrevWeek: () => void;
    navigateToNextWeek: () => void;
    setCurrentDate: (date: Date) => void;
    currentDate: Date;
    calendarData: CalendarData | null;
    isLoading: boolean;
    error: string | null;
};
//# sourceMappingURL=useSlotCalendar.d.ts.map