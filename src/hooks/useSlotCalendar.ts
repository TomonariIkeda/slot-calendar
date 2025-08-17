import { useState, useEffect, useCallback } from 'react';
import { CalendarData, SlotCalendarState } from '../types';
import { addDays } from '../utils/dateUtils';

export const useSlotCalendar = (
  initialDate: Date = new Date(),
  onLoadingChange?: (isLoading: boolean) => void
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
      // This would be replaced with actual API call
      const params = new URLSearchParams({
        shopId: shopId.toString(),
        year: state.currentDate.getFullYear().toString(),
        month: (state.currentDate.getMonth() + 1).toString(),
        day: state.currentDate.getDate().toString(),
        menuItemIds: encodeURIComponent(JSON.stringify(menuItemIds))
      });

      if (staffId) {
        params.append('staffId', staffId.toString());
      }
      if (reservationId) {
        params.append('reservationId', reservationId.toString());
      }

      // Mock API call - replace with actual fetch
      const response = await fetch(`/api/slots?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load slots');
      }

      const calendarData: CalendarData = await response.json();
      setCalendarData(calendarData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [state.currentDate, setLoading, setError, setCalendarData]);

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