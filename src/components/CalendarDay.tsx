import React from 'react';
import { CalendarDay as CalendarDayType, TimeSlot as TimeSlotType } from '../types';
import { TimeSlot } from './TimeSlot';
import { formatDate } from '../utils/dateUtils';

interface CalendarDayProps {
  day: CalendarDayType;
  onSlotClick: (slot: TimeSlotType) => void;
  isSlotSelected: (slotId: string) => boolean;
  className?: string;
  disabled?: boolean;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onSlotClick,
  isSlotSelected,
  className = '',
  disabled = false,
}) => {
  const getDayClassName = () => {
    const baseClass = 'reservation-calendar__day';
    const classes = [baseClass];

    if (className) classes.push(className);
    if (day.isToday) classes.push(`${baseClass}--today`);
    if (day.isSelected) classes.push(`${baseClass}--selected`);
    if (day.isDisabled) classes.push(`${baseClass}--disabled`);

    return classes.join(' ');
  };

  return (
    <div className={getDayClassName()}>
      <div className="reservation-calendar__day-header">
        <h3 className="reservation-calendar__day-date">
          {formatDate(day.date)}
        </h3>
        {day.isToday && (
          <span className="reservation-calendar__day-today-indicator">Today</span>
        )}
      </div>
      
      <div className="reservation-calendar__day-slots">
        {day.slots.length === 0 ? (
          <div className="reservation-calendar__no-slots">
            No available time slots
          </div>
        ) : (
          day.slots.map((slot) => (
            <TimeSlot
              key={slot.id}
              slot={slot}
              isSelected={isSlotSelected(slot.id)}
              onClick={onSlotClick}
              disabled={disabled || day.isDisabled}
            />
          ))
        )}
      </div>
    </div>
  );
};