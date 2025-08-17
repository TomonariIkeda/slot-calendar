import React from 'react';
import { TimeSlot as TimeSlotType } from '../types';
import { formatTime } from '../utils/dateUtils';

interface TimeSlotProps {
  slot: TimeSlotType;
  isSelected: boolean;
  onClick: (slot: TimeSlotType) => void;
  className?: string;
  disabled?: boolean;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  slot,
  isSelected,
  onClick,
  className = '',
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && slot.available && !slot.reserved) {
      onClick(slot);
    }
  };

  const getSlotClassName = () => {
    const baseClass = 'reservation-calendar__time-slot';
    const classes = [baseClass];

    if (className) classes.push(className);
    if (isSelected) classes.push(`${baseClass}--selected`);
    if (!slot.available) classes.push(`${baseClass}--unavailable`);
    if (slot.reserved) classes.push(`${baseClass}--reserved`);
    if (disabled) classes.push(`${baseClass}--disabled`);

    return classes.join(' ');
  };

  const isClickable = !disabled && slot.available && !slot.reserved;

  return (
    <button
      type="button"
      className={getSlotClassName()}
      onClick={handleClick}
      disabled={!isClickable}
      aria-label={`Time slot ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
      aria-pressed={isSelected}
    >
      <span className="reservation-calendar__time-slot-time">
        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
      </span>
      {slot.reserved && (
        <span className="reservation-calendar__time-slot-status">Reserved</span>
      )}
      {!slot.available && !slot.reserved && (
        <span className="reservation-calendar__time-slot-status">Unavailable</span>
      )}
    </button>
  );
};