import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SlotCalendar } from '../src/components/SlotCalendar';
import { CalendarData, SlotStatus } from '../src/types';

const meta: Meta<typeof SlotCalendar> = {
  title: 'Components/SlotCalendar',
  component: SlotCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    shopId: {
      control: { type: 'number' },
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock state for tracking current week
let mockCurrentWeek = 0; // 0 = current week, -1 = prev week, +1 = next week

// Mock API response that changes based on current week
const createMockCalendarData = (weekOffset: number = 0): CalendarData => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
  
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIndex);
    
    const slots = Array.from({ length: 20 }, (_, slotIndex) => ({
      staffId: 1,
      // Make pattern predictable based on date and slot for easier testing
      status: (dayIndex + slotIndex) % 3 === 0 ? SlotStatus.AVAILABLE : 
              (dayIndex + slotIndex) % 3 === 1 ? SlotStatus.RESERVED : 
              SlotStatus.UNAVAILABLE,
      startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9 + Math.floor(slotIndex / 2), (slotIndex % 2) * 30),
      endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9 + Math.floor(slotIndex / 2), (slotIndex % 2) * 30 + 30)
    }));

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      weekday: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()],
      slots
    };
  });

  const firstDay = days[0];
  return {
    year: firstDay.year,
    month: firstDay.month,
    day: firstDay.day,
    firstSlotStartAt: '09:00',
    availabilityIncrements: 30,
    hasPrev: true,
    hasNext: true,
    days,
    syncTokens: [{ staffId: 1, syncToken: 'mock-sync-token' }]
  };
};

// Mock fetch for stories that responds to URL parameters
const mockFetch = () => {
  global.fetch = ((url: string) => {
    // Parse URL to get date parameters
    const urlObj = new URL(url, 'http://localhost');
    const year = parseInt(urlObj.searchParams.get('year') || '2024');
    const month = parseInt(urlObj.searchParams.get('month') || '8');
    const day = parseInt(urlObj.searchParams.get('day') || '19');
    
    // Create a date from the URL parameters
    const requestDate = new Date(year, month - 1, day);
    const today = new Date();
    const weekDiff = Math.floor((requestDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(createMockCalendarData(weekDiff)),
    });
  }) as any;
};

export const Default: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1, 2],
    onSlotSelect: (slotData) => {
      console.log('Selected slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const WithStaffSelected: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    staffId: 456,
    isStaffSelected: true,
    onSlotSelect: (slotData) => {
      console.log('Selected staff slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const Disabled: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    disabled: true,
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const WithLoadingHandler: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onLoadingChange: (isLoading) => {
      console.log('Loading state:', isLoading);
    },
    onSlotSelect: (slotData) => {
      console.log('Selected slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const LoadingState: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
  },
  decorators: [
    (Story) => {
      // Mock fetch with delayed response to show loading state
      global.fetch = (() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve(createMockCalendarData(0)),
            });
          }, 3000); // 3 second delay to show loading
        })
      ) as any;
      return <Story />;
    },
  ],
};

export const LoadingError: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
  },
  decorators: [
    (Story) => {
      // Mock fetch that returns error after delay
      global.fetch = (() =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('ネットワークエラー: サーバーに接続できません'));
          }, 1500);
        })
      ) as any;
      return <Story />;
    },
  ],
};

export const MobileView: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onSlotSelect: (slotData) => {
      console.log('Selected slot (mobile):', slotData);
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'モバイル表示での予約カレンダー。小さな画面でも使いやすいようにレスポンシブデザインが適用されます。',
      },
    },
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const TabletView: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onSlotSelect: (slotData) => {
      console.log('Selected slot (tablet):', slotData);
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'タブレット表示での予約カレンダー。',
      },
    },
  },
  decorators: [
    (Story) => {
      mockFetch();
      return <Story />;
    },
  ],
};

export const NavigationDisabled: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onSlotSelect: (slotData) => {
      console.log('Selected slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      // Mock fetch that returns data with navigation disabled
      global.fetch = (() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...createMockCalendarData(0),
            hasPrev: false, // Disable previous button
            hasNext: false, // Disable next button
          }),
        })
      ) as any;
      return <Story />;
    },
  ],
};

export const OnlyPrevDisabled: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onSlotSelect: (slotData) => {
      console.log('Selected slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      // Mock fetch that disables only previous button
      global.fetch = (() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...createMockCalendarData(0),
            hasPrev: false, // Disable previous button
            hasNext: true,  // Enable next button
          }),
        })
      ) as any;
      return <Story />;
    },
  ],
};

export const OnlyNextDisabled: Story = {
  args: {
    shopId: 123,
    menuItemIds: [1],
    onSlotSelect: (slotData) => {
      console.log('Selected slot:', slotData);
    },
  },
  decorators: [
    (Story) => {
      // Mock fetch that disables only next button
      global.fetch = (() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...createMockCalendarData(0),
            hasPrev: true,  // Enable previous button
            hasNext: false, // Disable next button
          }),
        })
      ) as any;
      return <Story />;
    },
  ],
};