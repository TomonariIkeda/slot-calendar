import { useState, useEffect, useCallback } from 'react';
import { CalendarData, SlotCalendarState } from '../types';
import { addDays } from '../utils/dateUtils';
import { DataProvider, ApiDataProvider } from '../providers';

export const useSlotCalendar = (
  initialDate: Date = new Date(),
  onLoadingChange?: (isLoading: boolean) => void,
  dataProvider?: DataProvider
) => {
  const [state, setState] = useState<SlotCalendarState>({
    currentDate: initialDate,
    calendarData: null,
    isLoading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
    onLoadingChange?.(loading);
  }, [onLoadingChange]);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setCalendarData = useCallback((data: CalendarData | null) => {
    setState(prev => ({ ...prev, calendarData: data }));
  }, []);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const days = direction === 'next' ? 7 : -7;
    const newDate = addDays(state.currentDate, days);
    setState(prev => ({ ...prev, currentDate: newDate }));
  }, [state.currentDate]);

  // Use provided data provider or default to API provider
  const provider = dataProvider || new ApiDataProvider();

  const loadSlots = useCallback(async (
    menuItemIds: number[],
    staffId: number | undefined,
    isStaffSelected: boolean,
    shopId: number,
    reservationId?: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const calendarData = await provider.fetchSlots({
        shopId,
        year: state.currentDate.getFullYear(),
        month: state.currentDate.getMonth() + 1,
        day: state.currentDate.getDate(),
        menuItemIds,
        staffId,
        reservationId
      });
      
      setCalendarData(calendarData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [state.currentDate, provider, setLoading, setError, setCalendarData]);

  const navigateToPrevWeek = useCallback(() => {
    navigateWeek('prev');
  }, [navigateWeek]);

  const navigateToNextWeek = useCallback(() => {
    navigateWeek('next');
  }, [navigateWeek]);

  return {
    ...state,
    loadSlots,
    navigateToPrevWeek,
    navigateToNextWeek,
    setCurrentDate: (date: Date) => setState(prev => ({ ...prev, currentDate: date }))
  };
};