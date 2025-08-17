# Slot Calendar

A simple and lightweight slot calendar component for React applications. Perfect for booking systems, appointment scheduling, and time slot management.

## Features

- 📅 **Week View**: Clean week-based calendar layout
- 🎯 **Time Slot Management**: Display available, unavailable, and reserved time slots
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Customizable Styling**: Easy to theme and customize
- ♿ **Accessibility**: Built with ARIA labels and keyboard navigation
- 🔧 **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- 🪶 **Lightweight**: Minimal dependencies and optimized bundle size
- 🧪 **Well Tested**: Comprehensive test coverage

## Installation

```bash
npm install slot-calendar
# or
yarn add slot-calendar
# or
pnpm add slot-calendar
```

## Quick Start

```tsx
import React from 'react';
import { SlotCalendar, TimeSlot } from 'slot-calendar';

const availableSlots: TimeSlot[] = [
  {
    id: '1',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T09:30:00'),
    available: true,
  },
  {
    id: '2',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T10:30:00'),
    available: true,
  },
  // ... more slots
];

function App() {
  const handleSlotSelect = (slot: TimeSlot) => {
    console.log('Selected slot:', slot);
  };

  return (
    <SlotCalendar
      availableSlots={availableSlots}
      onSlotSelect={handleSlotSelect}
    />
  );
}
```

## Props

### SlotCalendarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startDate` | `Date` | `new Date()` | Starting date for the calendar |
| `endDate` | `Date` | `undefined` | Ending date for the calendar |
| `businessHours` | `BusinessHours[]` | `[]` | Business hours configuration |
| `slotDuration` | `number` | `30` | Duration of each slot in minutes |
| `availableSlots` | `TimeSlot[]` | `[]` | Array of available time slots |
| `selectedSlots` | `string[]` | `[]` | Array of selected slot IDs |
| `onSlotSelect` | `(slot: TimeSlot) => void` | `undefined` | Callback when a slot is selected |
| `onSlotDeselect` | `(slot: TimeSlot) => void` | `undefined` | Callback when a slot is deselected |
| `onDateChange` | `(date: Date) => void` | `undefined` | Callback when date changes |
| `disabled` | `boolean` | `false` | Disable the entire calendar |
| `minSelectableDate` | `Date` | `undefined` | Minimum selectable date |
| `maxSelectableDate` | `Date` | `undefined` | Maximum selectable date |
| `className` | `string` | `''` | Additional CSS class name |
| `showWeekView` | `boolean` | `true` | Enable week view toggle |
| `locale` | `string` | `'en-US'` | Locale for date formatting |

### TimeSlot Interface

```tsx
interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  reserved?: boolean;
  metadata?: Record<string, any>;
}
```

### BusinessHours Interface

```tsx
interface BusinessHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}
```

## Usage Examples

### Healthcare Appointment Booking

```tsx
import { SlotCalendar, TimeSlot, BusinessHours } from 'slot-calendar';

const businessHours: BusinessHours[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }, // Friday (half day)
];

const doctorSlots: TimeSlot[] = [
  {
    id: 'appointment-1',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T09:30:00'),
    available: true,
    metadata: { doctor: 'Dr. Smith', type: 'consultation' }
  },
  // ... more appointments
];

function DoctorBooking() {
  return (
    <SlotCalendar
      availableSlots={doctorSlots}
      businessHours={businessHours}
      slotDuration={30}
      onSlotSelect={(slot) => {
        console.log('Booking appointment with', slot.metadata?.doctor);
      }}
    />
  );
}
```

### Beauty Salon Booking

```tsx
const salonSlots: TimeSlot[] = [
  {
    id: 'haircut-1',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    available: true,
    metadata: { service: 'Haircut', stylist: 'Alice', price: 50 }
  },
  {
    id: 'manicure-1',
    startTime: new Date('2024-01-15T11:00:00'),
    endTime: new Date('2024-01-15T11:30:00'),
    available: true,
    metadata: { service: 'Manicure', stylist: 'Bob', price: 35 }
  },
];

function SalonBooking() {
  return (
    <SlotCalendar
      availableSlots={salonSlots}
      slotDuration={60}
      onSlotSelect={(slot) => {
        const { service, stylist, price } = slot.metadata || {};
        console.log(`Booking ${service} with ${stylist} - $${price}`);
      }}
    />
  );
}
```

### Meeting Room Reservation

```tsx
const meetingRoomSlots: TimeSlot[] = [
  {
    id: 'room-a-1',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T10:00:00'),
    available: true,
    metadata: { room: 'Conference Room A', capacity: 10 }
  },
  {
    id: 'room-a-2',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    available: false,
    reserved: true,
    metadata: { room: 'Conference Room A', bookedBy: 'Marketing Team' }
  },
];

function MeetingRoomBooking() {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  return (
    <SlotCalendar
      availableSlots={meetingRoomSlots}
      selectedSlots={selectedSlots}
      onSlotSelect={(slot) => {
        setSelectedSlots(prev => [...prev, slot.id]);
      }}
      onSlotDeselect={(slot) => {
        setSelectedSlots(prev => prev.filter(id => id !== slot.id));
      }}
    />
  );
}
```

## Styling

The component comes with default styling that can be customized:

```css
/* Override default styles */
.slot-calendar {
  --primary-color: #your-brand-color;
  --border-color: #your-border-color;
  --background-color: #your-background-color;
}

/* Custom slot styling */
.slot-calendar__time-slot--selected {
  background: #your-selected-color;
}
```

## Accessibility

The component is built with accessibility in mind:

- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ High contrast support
- ✅ Semantic HTML structure

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run Storybook
npm run storybook

# Build the package
npm run build
```

## Testing

The package includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [YoyakuDX](https://github.com/yoyakudx)

## Related Packages

- [`simple-slots`](https://github.com/yoyakudx/simple-slots) - Time slot calculation library
- [`simple-slots-multi`](https://github.com/yoyakudx/simple-slots-multi) - Multi-resource slot management