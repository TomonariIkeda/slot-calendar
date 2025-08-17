import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useCallback, useRef, useEffect } from 'react';

const formatTime = (time) => {
    return time;
};
const formatDateTime = (date, locale = 'ja') => {
    if (locale === 'ja') {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'short'
        }) + ' ' + date.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short'
    }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
const addMinutes = (date, minutes) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
};
const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
};
const createTimeSlotFromString = (baseDate, timeString, incrementMinutes, slotIndex) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const result = new Date(baseDate);
    result.setHours(hours, minutes, 0, 0);
    result.setMinutes(result.getMinutes() + (incrementMinutes * slotIndex));
    return result;
};

const useSlotCalendar = (initialDate = new Date(), onLoadingChange) => {
    const [state, setState] = useState({
        currentDate: initialDate,
        calendarData: null,
        isLoading: false,
        error: null
    });
    const setLoading = useCallback((loading) => {
        setState(prev => ({ ...prev, isLoading: loading }));
        onLoadingChange?.(loading);
    }, [onLoadingChange]);
    const setError = useCallback((error) => {
        setState(prev => ({ ...prev, error }));
    }, []);
    const setCalendarData = useCallback((data) => {
        setState(prev => ({ ...prev, calendarData: data }));
    }, []);
    const navigateWeek = useCallback((direction) => {
        const days = direction === 'next' ? 7 : -7;
        const newDate = addDays(state.currentDate, days);
        setState(prev => ({ ...prev, currentDate: newDate }));
    }, [state.currentDate]);
    const loadSlots = useCallback(async (menuItemIds, staffId, isStaffSelected, shopId, reservationId) => {
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
            const calendarData = await response.json();
            setCalendarData(calendarData);
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
        finally {
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
        setCurrentDate: (date) => setState(prev => ({ ...prev, currentDate: date }))
    };
};

const SLOT_ARRAY_INDEX = {
    STAFF_ID: 0,
    SLOTS_STATUS: 1,
};
const SLOTS_STATUS = {
    UNAVAILABLE: 'unavailable',
    AVAILABLE: 'available',
    RESERVED: 'reserved'
};
const SLOT_SYMBOLS = {
    [SLOTS_STATUS.UNAVAILABLE]: '-',
    [SLOTS_STATUS.AVAILABLE]: '◎',
    [SLOTS_STATUS.RESERVED]: '×'
};
const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SlotCalendar = ({ menuItemIds = [], staffId, isStaffSelected = false, shopId, reservationId, initialDate = new Date(), onSlotSelect, onLoadingChange, className = '', disabled = false }) => {
    const { currentDate, calendarData, isLoading, error, loadSlots, navigateToPrevWeek, navigateToNextWeek } = useSlotCalendar(initialDate, onLoadingChange);
    const tableRef = useRef(null);
    // Load slots when dependencies change
    useEffect(() => {
        if (menuItemIds.length > 0) {
            loadSlots(menuItemIds, staffId, isStaffSelected, shopId, reservationId);
        }
    }, [currentDate, menuItemIds, staffId, isStaffSelected, shopId, reservationId, loadSlots]);
    // Initialize calendar structure
    const initializeCalendar = () => {
        if (!calendarData || !tableRef.current)
            return;
        const table = tableRef.current;
        table.innerHTML = '';
        // Create header rows
        const monthRow = document.createElement('tr');
        monthRow.id = 'cal-month-tr';
        monthRow.className = 'cal-month';
        monthRow.innerHTML = `
      <th rowspan="2"></th>
      <th id="cal-month-th" colspan="7">${calendarData.year}年${calendarData.month}月</th>
    `;
        const weekRow = document.createElement('tr');
        weekRow.id = 'cal-week-tr';
        let weekRowHTML = '';
        calendarData.days.forEach((day, i) => {
            const dayClass = getDayClass(day.weekday);
            weekRowHTML += `
        <th id="cal-day-${i + 1}" class="cal-day-th ${dayClass}">
          <span id="cal-date-${i + 1}" class="cal-date">${day.day}</span>
          <span id="cal-weekday-${i + 1}" class="cal-weekday">${day.weekday}</span>
        </th>
      `;
        });
        weekRow.innerHTML = weekRowHTML;
        table.appendChild(monthRow);
        table.appendChild(weekRow);
        // Create time slot rows
        const numSlots = calendarData.days[0]?.slots?.length || 0;
        for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
            const timeRow = document.createElement('tr');
            timeRow.id = `cal-time-tr-${slotIndex + 1}`;
            timeRow.className = 'cal-time-slot';
            // Time header
            const timeSlot = createTimeSlotFromString(new Date(calendarData.year, calendarData.month - 1, calendarData.day), calendarData.firstSlotStartAt, calendarData.availabilityIncrements, slotIndex);
            let rowHTML = `<th id="cal-time-th-${slotIndex + 1}" class="cal-time">${timeSlot.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</th>`;
            // Day cells
            calendarData.days.forEach((day, dayIndex) => {
                const slot = day.slots[slotIndex];
                if (slot) {
                    const cellId = `cal-time-td-${slotIndex + 1}-${dayIndex + 1}`;
                    const cellClass = getCellClass(slot.status);
                    const symbol = SLOT_SYMBOLS[slot.status];
                    rowHTML += `<td id="${cellId}" class="${cellClass}" data-slot-index="${slotIndex}" data-day-index="${dayIndex}">${symbol}</td>`;
                }
                else {
                    rowHTML += `<td class="off">-</td>`;
                }
            });
            timeRow.innerHTML = rowHTML;
            table.appendChild(timeRow);
        }
        // Add click handlers
        addClickHandlers();
    };
    const getDayClass = (weekday) => {
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
    const getCellClass = (status) => {
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
        if (!calendarData || !tableRef.current)
            return;
        const cells = tableRef.current.querySelectorAll('td[data-slot-index]');
        cells.forEach((cell) => {
            cell.addEventListener('click', handleSlotClick);
        });
    };
    const handleSlotClick = (event) => {
        if (disabled)
            return;
        const target = event.target;
        if (target.textContent !== '◎')
            return; // Only available slots
        const slotIndex = parseInt(target.dataset.slotIndex || '0');
        const dayIndex = parseInt(target.dataset.dayIndex || '0');
        if (!calendarData || !calendarData.days[dayIndex])
            return;
        const day = calendarData.days[dayIndex];
        const slot = day.slots[slotIndex];
        if (!slot || slot.status !== SLOTS_STATUS.AVAILABLE)
            return;
        // Calculate the exact start time
        const startTime = createTimeSlotFromString(new Date(day.year, day.month - 1, day.day), calendarData.firstSlotStartAt, calendarData.availabilityIncrements, slotIndex);
        // Find sync token for the staff
        const syncToken = calendarData.syncTokens?.find(token => token.staffId === slot.staffId)?.syncToken || calendarData.syncToken || '';
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
    // Initialize calendar when data changes
    useEffect(() => {
        if (calendarData) {
            initializeCalendar();
        }
    }, [calendarData]);
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
        if (className)
            classes.push(className);
        if (disabled)
            classes.push(`${baseClass}--disabled`);
        if (isLoading)
            classes.push(`${baseClass}--loading`);
        return classes.join(' ');
    };
    return (jsxs("div", { className: getCalendarClassName(), children: [jsx("div", { className: "slot-calendar__header", children: jsxs("div", { className: "slot-calendar__navigation", children: [jsxs("button", { id: "cal-prev-btn", className: "slot-calendar__nav-button", onClick: handlePrevWeek, disabled: disabled || isLoading || !calendarData?.hasPrev, children: [jsx("span", { className: "material-icons", children: "navigate_before" }), "\u524D\u306E\u9031"] }), jsxs("button", { id: "cal-next-btn", className: "slot-calendar__nav-button", onClick: handleNextWeek, disabled: disabled || isLoading || !calendarData?.hasNext, children: ["\u6B21\u306E\u9031", jsx("span", { className: "material-icons", children: "navigate_next" })] })] }) }), isLoading && (jsx("div", { className: "slot-calendar__progress", children: jsx("div", { className: "progress-bar" }) })), error && (jsxs("div", { className: "slot-calendar__error", children: ["\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F: ", error] })), jsx("div", { className: "slot-calendar__table-wrapper", children: jsx("table", { ref: tableRef, id: "cal-table", className: "slot-calendar__table", style: { opacity: isLoading ? 0.5 : 1 } }) })] }));
};

var SlotStatus;
(function (SlotStatus) {
    SlotStatus["UNAVAILABLE"] = "unavailable";
    SlotStatus["AVAILABLE"] = "available";
    SlotStatus["RESERVED"] = "reserved";
})(SlotStatus || (SlotStatus = {}));

export { SLOTS_STATUS, SLOT_ARRAY_INDEX, SLOT_SYMBOLS, SlotCalendar, SlotStatus, WEEKDAYS_EN, WEEKDAYS_JP, addDays, addMinutes, createTimeSlotFromString, formatDateTime, formatTime, startOfWeek, useSlotCalendar };
//# sourceMappingURL=index.esm.js.map
