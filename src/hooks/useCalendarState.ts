import { useReducer, useCallback } from 'react';
import { CalendarState, CalendarAction, TimeSlot } from '../types';

const initialState: CalendarState = {
  currentDate: new Date(),
  selectedDate: new Date(),
  selectedSlots: new Set<string>(),
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return {
        ...state,
        currentDate: action.payload,
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      };
    case 'TOGGLE_SLOT':
      const newSelectedSlots = new Set(state.selectedSlots);
      if (newSelectedSlots.has(action.payload)) {
        newSelectedSlots.delete(action.payload);
      } else {
        newSelectedSlots.add(action.payload);
      }
      return {
        ...state,
        selectedSlots: newSelectedSlots,
      };
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedSlots: new Set<string>(),
      };
    default:
      return state;
  }
};

export const useCalendarState = () => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const setCurrentDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: date });
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  const toggleSlot = useCallback((slotId: string) => {
    dispatch({ type: 'TOGGLE_SLOT', payload: slotId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const isSlotSelected = useCallback((slotId: string) => {
    return state.selectedSlots.has(slotId);
  }, [state.selectedSlots]);

  return {
    ...state,
    setCurrentDate,
    setSelectedDate,
    toggleSlot,
    clearSelection,
    isSlotSelected,
  };
};