import { renderHook, act, waitFor } from '@testing-library/react';
import { useSlotCalendar } from './useSlotCalendar';
import { CalendarData } from '../types';

// Mock fetch
global.fetch = jest.fn();

const mockCalendarData: CalendarData = {
  year: 2024,
  month: 8,
  day: 19,
  firstSlotStartAt: '09:00',
  availabilityIncrements: 30,
  hasPrev: true,
  hasNext: true,
  days: [],
  syncToken: 'test-token',
};

describe('useSlotCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCalendarData),
    });
  });

  it('initializes with correct default state', () => {
    const initialDate = new Date(2024, 7, 19);
    const { result } = renderHook(() => useSlotCalendar(initialDate));

    expect(result.current.currentDate).toEqual(initialDate);
    expect(result.current.calendarData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls onLoadingChange when loading state changes', async () => {
    const onLoadingChange = jest.fn();
    const { result } = renderHook(() => useSlotCalendar(new Date(), onLoadingChange));

    await act(async () => {
      result.current.loadSlots([1, 2], undefined, false, 123);
    });

    expect(onLoadingChange).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
      expect(onLoadingChange).toHaveBeenCalledWith(false);
    });
  });

  it('loads slots successfully', async () => {
    const { result } = renderHook(() => useSlotCalendar());

    await act(async () => {
      result.current.loadSlots([1, 2], 456, true, 123, 789);
    });

    await waitFor(() => {
      expect(result.current.calendarData).toEqual(mockCalendarData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/slots?')
    );
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useSlotCalendar());

    await act(async () => {
      result.current.loadSlots([1], undefined, false, 123);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.calendarData).toBeNull();
    });
  });

  it('handles HTTP error response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });
    const { result } = renderHook(() => useSlotCalendar());

    await act(async () => {
      result.current.loadSlots([1], undefined, false, 123);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load slots');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('navigates to previous week', () => {
    const initialDate = new Date(2024, 7, 19); // Monday
    const { result } = renderHook(() => useSlotCalendar(initialDate));

    act(() => {
      result.current.navigateToPrevWeek();
    });

    const expectedDate = new Date(2024, 7, 12); // Previous Monday
    expect(result.current.currentDate).toEqual(expectedDate);
  });

  it('navigates to next week', () => {
    const initialDate = new Date(2024, 7, 19); // Monday
    const { result } = renderHook(() => useSlotCalendar(initialDate));

    act(() => {
      result.current.navigateToNextWeek();
    });

    const expectedDate = new Date(2024, 7, 26); // Next Monday
    expect(result.current.currentDate).toEqual(expectedDate);
  });

  it('sets current date', () => {
    const { result } = renderHook(() => useSlotCalendar());
    const newDate = new Date(2024, 8, 1);

    act(() => {
      result.current.setCurrentDate(newDate);
    });

    expect(result.current.currentDate).toEqual(newDate);
  });

  it('builds correct API URL with all parameters', async () => {
    const { result } = renderHook(() => useSlotCalendar(new Date(2024, 7, 19)));

    await act(async () => {
      result.current.loadSlots([1, 2, 3], 456, true, 123, 789);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/slots\?.*shopId=123.*year=2024.*month=8.*day=19.*staffId=456.*reservationId=789/)
    );
  });

  it('builds API URL without optional parameters', async () => {
    const { result } = renderHook(() => useSlotCalendar(new Date(2024, 7, 19)));

    await act(async () => {
      result.current.loadSlots([1], undefined, false, 123);
    });

    const call = (fetch as jest.Mock).mock.calls[0][0];
    expect(call).toMatch(/\/api\/slots\?.*shopId=123.*year=2024.*month=8.*day=19/);
    expect(call).not.toMatch(/staffId/);
    expect(call).not.toMatch(/reservationId/);
  });
});