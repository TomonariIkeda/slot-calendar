import React from 'react';
import { SlotCalendar } from '../components/SlotCalendar';
import { StaticDataProvider } from '../providers/StaticDataProvider';
import { CalendarData, SlotStatus } from '../types';

/**
 * Example: Using SlotCalendar with custom predefined data
 */
export const CustomDataExample: React.FC = () => {
  // Create custom calendar data
  const customData: CalendarData = {
    year: 2024,
    month: 8,
    day: 19,
    firstSlotStartAt: '10:00',
    availabilityIncrements: 60, // 1-hour slots
    hasPrev: false,
    hasNext: true,
    days: [
      {
        year: 2024,
        month: 8,
        day: 18,
        weekday: '日',
        slots: [] // Sunday - closed
      },
      {
        year: 2024,
        month: 8,
        day: 19,
        weekday: '月',
        slots: [
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 19, 10, 0),
            endTime: new Date(2024, 7, 19, 11, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.RESERVED,
            startTime: new Date(2024, 7, 19, 11, 0),
            endTime: new Date(2024, 7, 19, 12, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 19, 13, 0),
            endTime: new Date(2024, 7, 19, 14, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 19, 14, 0),
            endTime: new Date(2024, 7, 19, 15, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.UNAVAILABLE,
            startTime: new Date(2024, 7, 19, 15, 0),
            endTime: new Date(2024, 7, 19, 16, 0)
          }
        ]
      },
      {
        year: 2024,
        month: 8,
        day: 20,
        weekday: '火',
        slots: [
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 20, 10, 0),
            endTime: new Date(2024, 7, 20, 11, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 20, 11, 0),
            endTime: new Date(2024, 7, 20, 12, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.AVAILABLE,
            startTime: new Date(2024, 7, 20, 13, 0),
            endTime: new Date(2024, 7, 20, 14, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.RESERVED,
            startTime: new Date(2024, 7, 20, 14, 0),
            endTime: new Date(2024, 7, 20, 15, 0)
          },
          {
            staffId: 1,
            status: SlotStatus.RESERVED,
            startTime: new Date(2024, 7, 20, 15, 0),
            endTime: new Date(2024, 7, 20, 16, 0)
          }
        ]
      },
      // Add more days as needed...
      {
        year: 2024,
        month: 8,
        day: 21,
        weekday: '水',
        slots: []
      },
      {
        year: 2024,
        month: 8,
        day: 22,
        weekday: '木',
        slots: []
      },
      {
        year: 2024,
        month: 8,
        day: 23,
        weekday: '金',
        slots: []
      },
      {
        year: 2024,
        month: 8,
        day: 24,
        weekday: '土',
        slots: []
      }
    ],
    syncToken: 'custom-data-token'
  };

  // Create a static data provider with custom data
  const dataProvider = new StaticDataProvider(0, customData);

  const handleSlotSelect = (slotData: any) => {
    console.log('Selected slot:', slotData);
    alert(`Selected: ${new Date(slotData.startAt).toLocaleString()}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Slot Calendar with Custom Data</h1>
      <p>This example uses predefined custom data structure.</p>
      <p>Monday and Tuesday have 1-hour slots from 10:00 to 16:00.</p>
      
      <SlotCalendar
        shopId={1}
        menuItemIds={[1]}
        dataProvider={dataProvider}
        onSlotSelect={handleSlotSelect}
      />
    </div>
  );
};