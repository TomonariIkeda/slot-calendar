import React, { useEffect, useMemo } from 'react';
import { ReservationCalendarProps, CalendarDay as CalendarDayType, TimeSlot } from '../types';
import { useCalendarState } from '../hooks/useCalendarState';
import { CalendarDay } from './CalendarDay';
import { getWeekDays, isSameDay, addDays } from '../utils/dateUtils';

export const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  startDate = new Date(),
  endDate,
  businessHours = [],
  slotDuration = 30,
  availableSlots = [],
  selectedSlots = [],
  onSlotSelect,
  onSlotDeselect,
  onDateChange,
  disabled = false,
  minSelectableDate,
  maxSelectableDate,
  className = '',
  locale = 'en-US',
}) => {
  const {
    currentDate,
    selectedDate,
    selectedSlots: internalSelectedSlots,
    setCurrentDate,
    setSelectedDate,
    toggleSlot,
    isSlotSelected,
  } = useCalendarState();

  // Sync external selectedSlots with internal state
  useEffect(() => {
    // This is a simplified implementation
    // In a real scenario, you'd want to manage this more carefully
  }, [selectedSlots]);

  const displayDates = useMemo(() => {
    return getWeekDays(currentDate);
  }, [currentDate]);

  const calendarDays = useMemo((): CalendarDayType[] => {
    return displayDates.map((date) => {
      const daySlots = availableSlots.filter((slot) =>
        isSameDay(slot.startTime, date)
      );

      const isToday = isSameDay(date, new Date());
      const isSelected = isSameDay(date, selectedDate);
      const isDisabled = 
        (minSelectableDate && date < minSelectableDate) ||
        (maxSelectableDate && date > maxSelectableDate) ||
        (endDate && date > endDate);

      return {
        date,
        slots: daySlots,
        isToday,
        isSelected,
        isDisabled,
      };
    });
  }, [displayDates, availableSlots, selectedDate, minSelectableDate, maxSelectableDate, endDate]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (disabled) return;

    const wasSelected = isSlotSelected(slot.id);
    toggleSlot(slot.id);

    if (wasSelected) {
      onSlotDeselect?.(slot);
    } else {
      onSlotSelect?.(slot);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentDate, direction === 'next' ? 7 : -7);
    setCurrentDate(newDate);
  };

  const getCalendarClassName = () => {
    const baseClass = 'reservation-calendar';
    const classes = [baseClass];

    if (className) classes.push(className);
    if (disabled) classes.push(`${baseClass}--disabled`);
    classes.push(`${baseClass}--week-view`);

    return classes.join(' ');
  };

  return (
    <div className={getCalendarClassName()}>
      {/* Navigation Header */}
      <div className="reservation-calendar__header">
        <div className="reservation-calendar__navigation">
          <button
            type="button"
            className="reservation-calendar__nav-button"
            onClick={() => navigateWeek('prev')}
            disabled={disabled}
            aria-label="Previous week"
          >
            ←
          </button>
          
          <h2 className="reservation-calendar__current-period">
            Week of {displayDates[0]?.toLocaleDateString(locale)}
          </h2>
          
          <button
            type="button"
            className="reservation-calendar__nav-button"
            onClick={() => navigateWeek('next')}
            disabled={disabled}
            aria-label="Next week"
          >
            →
          </button>
        </div>

      </div>

      {/* Calendar Grid */}
      <div className="reservation-calendar__grid">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={day.date.toISOString()}
            day={day}
            onSlotClick={handleSlotClick}
            isSlotSelected={isSlotSelected}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};