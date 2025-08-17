import React, { useEffect, useRef } from 'react';
import { SlotCalendarProps, CalendarDay, TimeSlot } from '../types';
import { useSlotCalendar } from '../hooks/useSlotCalendar';
import { SLOT_SYMBOLS, SLOTS_STATUS } from '../utils/constants';
import { createTimeSlotFromString, formatDateTime } from '../utils/dateUtils';

export const SlotCalendar: React.FC<SlotCalendarProps> = ({
  menuItemIds = [],
  staffId,
  isStaffSelected = false,
  shopId,
  reservationId,
  initialDate = new Date(),
  onSlotSelect,
  onLoadingChange,
  className = '',
  disabled = false
}) => {
  const {
    currentDate,
    calendarData,
    isLoading,
    error,
    loadSlots,
    navigateToPrevWeek,
    navigateToNextWeek
  } = useSlotCalendar(initialDate, onLoadingChange);

  const tableRef = useRef<HTMLTableElement>(null);

  // Load slots when dependencies change
  useEffect(() => {
    if (menuItemIds.length > 0) {
      loadSlots(menuItemIds, staffId, isStaffSelected, shopId, reservationId);
    }
  }, [currentDate, menuItemIds, staffId, isStaffSelected, shopId, reservationId, loadSlots]);

  // Initialize calendar structure
  const initializeCalendar = () => {
    if (!tableRef.current) return;

    const table = tableRef.current;
    table.innerHTML = '';

    // Use calendarData if available, or create skeleton structure
    const year = calendarData?.year || currentDate.getFullYear();
    const month = calendarData?.month || (currentDate.getMonth() + 1);
    
    // Create header rows
    const monthRow = document.createElement('tr');
    monthRow.id = 'cal-month-tr';
    monthRow.className = 'cal-month';
    monthRow.innerHTML = `
      <th rowspan="2"></th>
      <th id="cal-month-th" colspan="7">${year}年${month}月</th>
    `;

    const weekRow = document.createElement('tr');
    weekRow.id = 'cal-week-tr';
    let weekRowHTML = '';
    
    if (calendarData?.days) {
      calendarData.days.forEach((day, i) => {
        const dayClass = getDayClass(day.weekday);
        weekRowHTML += `
          <th id="cal-day-${i + 1}" class="cal-day-th ${dayClass}">
            <span id="cal-date-${i + 1}" class="cal-date">${day.day}</span>
            <span id="cal-weekday-${i + 1}" class="cal-weekday">${day.weekday}</span>
          </th>
        `;
      });
    } else {
      // Create skeleton weekday headers
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      weekdays.forEach((weekday, i) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i);
        const dayClass = getDayClass(weekday);
        weekRowHTML += `
          <th id="cal-day-${i + 1}" class="cal-day-th ${dayClass}">
            <span id="cal-date-${i + 1}" class="cal-date">${dayDate.getDate()}</span>
            <span id="cal-weekday-${i + 1}" class="cal-weekday">${weekday}</span>
          </th>
        `;
      });
    }
    weekRow.innerHTML = weekRowHTML;

    table.appendChild(monthRow);
    table.appendChild(weekRow);

    // Create time slot rows
    const numSlots = calendarData?.days?.[0]?.slots?.length || 20; // Default to 20 slots if no data
    for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
      const timeRow = document.createElement('tr');
      timeRow.id = `cal-time-tr-${slotIndex + 1}`;
      timeRow.className = 'cal-time-slot';

      // Time header
      let timeText = '';
      if (calendarData) {
        const timeSlot = createTimeSlotFromString(
          new Date(calendarData.year, calendarData.month - 1, calendarData.day),
          calendarData.firstSlotStartAt,
          calendarData.availabilityIncrements,
          slotIndex
        );
        timeText = timeSlot.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      } else {
        // Default time slots starting at 9:00 with 30-minute increments
        const hour = 9 + Math.floor(slotIndex / 2);
        const minute = (slotIndex % 2) * 30;
        timeText = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }
      
      let rowHTML = `<th id="cal-time-th-${slotIndex + 1}" class="cal-time">${timeText}</th>`;

      // Day cells
      if (calendarData?.days) {
        calendarData.days.forEach((day, dayIndex) => {
          const slot = day.slots[slotIndex];
          if (slot) {
            const cellId = `cal-time-td-${slotIndex + 1}-${dayIndex + 1}`;
            const cellClass = getCellClass(slot.status);
            const symbol = SLOT_SYMBOLS[slot.status];
            
            rowHTML += `<td id="${cellId}" class="${cellClass}" data-slot-index="${slotIndex}" data-day-index="${dayIndex}">${symbol}</td>`;
          } else {
            rowHTML += `<td class="off">-</td>`;
          }
        });
      } else {
        // Create skeleton cells when no data
        for (let i = 0; i < 7; i++) {
          rowHTML += `<td class="off skeleton">-</td>`;
        }
      }

      timeRow.innerHTML = rowHTML;
      table.appendChild(timeRow);
    }

    // Add click handlers
    addClickHandlers();
  };

  const getDayClass = (weekday: string): string => {
    switch (weekday) {
      case '祝':
      case '日':
        return 'red';
      case '土':
        return 'blue';
      default:
        return '';
    }
  };

  const getCellClass = (status: string): string => {
    switch (status) {
      case SLOTS_STATUS.AVAILABLE:
        return 'available red';
      case SLOTS_STATUS.RESERVED:
        return 'reserved gray';
      case SLOTS_STATUS.UNAVAILABLE:
      default:
        return 'off';
    }
  };

  const addClickHandlers = () => {
    if (!calendarData || !tableRef.current) return;

    const cells = tableRef.current.querySelectorAll('td[data-slot-index]');
    cells.forEach((cell) => {
      cell.addEventListener('click', handleSlotClick);
    });
  };

  const handleSlotClick = (event: Event) => {
    if (disabled) return;

    const target = event.target as HTMLElement;
    if (target.textContent !== '◎') return; // Only available slots

    const slotIndex = parseInt(target.dataset.slotIndex || '0');
    const dayIndex = parseInt(target.dataset.dayIndex || '0');

    if (!calendarData || !calendarData.days[dayIndex]) return;

    const day = calendarData.days[dayIndex];
    const slot = day.slots[slotIndex];

    if (!slot || slot.status !== SLOTS_STATUS.AVAILABLE) return;

    // Calculate the exact start time
    const startTime = createTimeSlotFromString(
      new Date(day.year, day.month - 1, day.day),
      calendarData.firstSlotStartAt,
      calendarData.availabilityIncrements,
      slotIndex
    );

    // Find sync token for the staff
    const syncToken = calendarData.syncTokens?.find(
      token => token.staffId === slot.staffId
    )?.syncToken || calendarData.syncToken || '';

    const slotData = {
      startAt: startTime.toISOString(),
      staff: {
        id: slot.staffId || 0,
        nameDisplay: isStaffSelected ? 'Selected Staff' : 'No Preference'
      },
      syncToken
    };

    onSlotSelect?.(slotData);
  };

  // Initialize calendar on mount and when data changes
  useEffect(() => {
    initializeCalendar();
  }, [calendarData, currentDate]); // Re-initialize when data or current date changes

  const handlePrevWeek = () => {
    if (!disabled && calendarData?.hasPrev) {
      navigateToPrevWeek();
    }
  };

  const handleNextWeek = () => {
    if (!disabled && calendarData?.hasNext) {
      navigateToNextWeek();
    }
  };

  const getCalendarClassName = () => {
    const baseClass = 'slot-calendar';
    const classes = [baseClass];

    if (className) classes.push(className);
    if (disabled) classes.push(`${baseClass}--disabled`);
    if (isLoading) classes.push(`${baseClass}--loading`);

    return classes.join(' ');
  };

  return (
    <div className={getCalendarClassName()}>
      {/* Navigation Header */}
      <div className="slot-calendar__header">
        <div className="slot-calendar__navigation">
          <button
            id="cal-prev-btn"
            className="slot-calendar__nav-button"
            onClick={handlePrevWeek}
            disabled={disabled || isLoading || !calendarData?.hasPrev}
          >
            <span className="slot-calendar__nav-icon">‹</span>
            前の週
          </button>

          <button
            id="cal-next-btn"
            className="slot-calendar__nav-button"
            onClick={handleNextWeek}
            disabled={disabled || isLoading || !calendarData?.hasNext}
          >
            次の週
            <span className="slot-calendar__nav-icon">›</span>
          </button>
        </div>
      </div>

      {/* Loading Progress */}
      {isLoading && (
        <div className="slot-calendar__progress">
          <div className="progress-bar"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="slot-calendar__error">
          エラーが発生しました: {error}
        </div>
      )}

      {/* Calendar Table */}
      <div className="slot-calendar__table-wrapper">
        <table
          ref={tableRef}
          id="cal-table"
          className="slot-calendar__table"
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          {/* Table content is dynamically generated */}
        </table>
      </div>
    </div>
  );
};