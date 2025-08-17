import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCalendar } from '../components/ReservationCalendar';
import { TimeSlot } from '../types';

const meta: Meta<typeof ReservationCalendar> = {
  title: 'Components/ReservationCalendar',
  component: ReservationCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    slotDuration: {
      control: { type: 'number', min: 15, max: 120, step: 15 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to generate mock slots
const generateMockSlots = (date: Date = new Date()): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(9, 0, 0, 0); // Start at 9 AM

  for (let i = 0; i < 16; i++) { // 8 hours of slots (30-min intervals)
    const startTime = new Date(baseDate);
    startTime.setMinutes(startTime.getMinutes() + (i * 30));
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    slots.push({
      id: `slot-${i}`,
      startTime,
      endTime,
      available: Math.random() > 0.3, // 70% available
      reserved: Math.random() > 0.9, // 10% reserved
    });
  }

  return slots;
};

const today = new Date();
const mockSlots = generateMockSlots(today);

export const Default: Story = {
  args: {
    availableSlots: mockSlots,
  },
};


export const WithBusinessHours: Story = {
  args: {
    availableSlots: mockSlots,
    businessHours: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
    ],
  },
};

export const DisabledState: Story = {
  args: {
    availableSlots: mockSlots,
    disabled: true,
  },
};

export const WithSelectedSlots: Story = {
  args: {
    availableSlots: mockSlots,
    selectedSlots: ['slot-2', 'slot-4'],
  },
};

export const EmptySlots: Story = {
  args: {
    availableSlots: [],
  },
};

export const MobileView: Story = {
  args: {
    availableSlots: mockSlots,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const HealthcareBooking: Story = {
  args: {
    availableSlots: generateMockSlots(today).map((slot, index) => ({
      ...slot,
      metadata: {
        type: 'consultation',
        duration: 30,
        doctor: index % 2 === 0 ? 'Dr. Smith' : 'Dr. Johnson',
      },
    })),
    slotDuration: 30,
  },
};

export const InteractiveExample: Story = {
  args: {
    availableSlots: mockSlots,
    onSlotSelect: (slot) => {
      console.log('Selected slot:', slot);
    },
    onSlotDeselect: (slot) => {
      console.log('Deselected slot:', slot);
    },
    onDateChange: (date) => {
      console.log('Date changed:', date);
    },
  },
};