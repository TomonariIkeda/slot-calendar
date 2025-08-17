import { DataProvider, FetchSlotsParams } from './DataProvider';
import { CalendarData, CalendarDay, TimeSlot, SlotStatus } from '../types';

/**
 * Static data provider that generates calendar data locally
 * Useful for development, testing, or when no backend is available
 */
export class StaticDataProvider implements DataProvider {
  private mockDelay: number;
  private customData?: CalendarData;

  constructor(mockDelay: number = 0, customData?: CalendarData) {
    this.mockDelay = mockDelay;
    this.customData = customData;
  }

  async fetchSlots(params: FetchSlotsParams): Promise<CalendarData> {
    // Simulate network delay if specified
    if (this.mockDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.mockDelay));
    }

    // Return custom data if provided
    if (this.customData) {
      return this.customData;
    }

    // Generate mock data based on parameters
    return this.generateMockData(params);
  }

  private generateMockData(params: FetchSlotsParams): CalendarData {
    const { year, month, day } = params;
    const baseDate = new Date(year, month - 1, day);
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(baseDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    // Generate 7 days of the week
    const days: CalendarDay[] = [];
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      // Generate slots for each day (9:00 to 18:00, 30-minute intervals)
      const slots: TimeSlot[] = [];
      const slotsPerDay = 18; // 9 hours * 2 slots per hour

      for (let slotIndex = 0; slotIndex < slotsPerDay; slotIndex++) {
        const hour = 9 + Math.floor(slotIndex / 2);
        const minute = (slotIndex % 2) * 30;
        
        const startTime = new Date(currentDate);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        // Generate random availability
        let status: SlotStatus;
        const random = Math.random();
        
        // Weekend logic
        if (i === 0 || i === 6) {
          // Sunday or Saturday - fewer available slots
          status = random < 0.3 ? SlotStatus.AVAILABLE : SlotStatus.UNAVAILABLE;
        } else {
          // Weekday - more varied status
          if (random < 0.5) {
            status = SlotStatus.AVAILABLE;
          } else if (random < 0.7) {
            status = SlotStatus.RESERVED;
          } else {
            status = SlotStatus.UNAVAILABLE;
          }
        }

        // Past slots are always unavailable
        if (startTime < new Date()) {
          status = SlotStatus.UNAVAILABLE;
        }

        slots.push({
          staffId: params.staffId || 1,
          status,
          startTime,
          endTime
        });
      }

      days.push({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        weekday: weekdays[i],
        slots
      });
    }

    // Determine if previous/next navigation should be enabled
    const today = new Date();
    const weekStart = new Date(startOfWeek);
    const hasPrev = weekStart > today; // Can go to previous week if current week is in future
    const hasNext = true; // Always allow going to next week

    return {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
      day: baseDate.getDate(),
      firstSlotStartAt: '09:00',
      availabilityIncrements: 30,
      hasPrev,
      hasNext,
      days,
      syncToken: `static-${Date.now()}`
    };
  }

  /**
   * Set custom static data to be returned
   */
  setCustomData(data: CalendarData) {
    this.customData = data;
  }

  /**
   * Clear custom data and revert to generated mock data
   */
  clearCustomData() {
    this.customData = undefined;
  }
}