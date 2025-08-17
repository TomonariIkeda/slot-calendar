# Slot Calendar

A simple table-based slot calendar component for React applications, compatible with YoyakuDX reservation system. Features a traditional weekly calendar layout with time slots displayed in a table format.

## Features

- 📅 **Weekly Table Layout**: Traditional table-based calendar display
- 🎯 **Slot Status Display**: Visual indicators for available (◎), reserved (×), and unavailable (-) slots
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Week Navigation**: Navigate between weeks with prev/next buttons
- 🎨 **YoyakuDX Compatible**: Matches the original YoyakuDX calendar styling
- 🔧 **TypeScript Support**: Full TypeScript support with comprehensive types
- ⚡ **Performance Optimized**: Efficient table rendering and event handling
- ♿ **Accessible**: Built with accessibility in mind

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
import { SlotCalendar } from 'slot-calendar';

function App() {
  const handleSlotSelect = (slotData) => {
    console.log('Selected slot:', slotData);
    // slotData contains: { startAt, staff, syncToken }
  };

  return (
    <SlotCalendar
      shopId={123}
      menuItemIds={[1, 2]}
      staffId={456}
      isStaffSelected={true}
      onSlotSelect={handleSlotSelect}
    />
  );
}
```

## Props

### SlotCalendarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shopId` | `number` | **required** | Shop identifier |
| `menuItemIds` | `number[]` | `[]` | Array of menu item IDs |
| `staffId` | `number` | `undefined` | Staff ID (for staff-specific slots) |
| `isStaffSelected` | `boolean` | `false` | Whether staff is specifically selected |
| `reservationId` | `number` | `undefined` | Reservation ID (for editing) |
| `initialDate` | `Date` | `new Date()` | Initial calendar date |
| `onSlotSelect` | `function` | `undefined` | Callback when slot is selected |
| `onLoadingChange` | `function` | `undefined` | Callback when loading state changes |
| `className` | `string` | `''` | Additional CSS class |
| `disabled` | `boolean` | `false` | Disable the calendar |

### Slot Selection Callback

The `onSlotSelect` callback receives a slot data object:

```tsx
interface SlotData {
  startAt: string;        // ISO string of slot start time
  staff: {
    id: number;           // Staff ID
    nameDisplay: string;  // Display name
  };
  syncToken: string;      // Calendar sync token
}
```

## API Integration

The calendar expects your API to respond to `GET /api/slots` with the following parameters:

- `shopId`: Shop identifier
- `staffId`: Staff ID (optional)
- `year`, `month`, `day`: Calendar date
- `menuItemIds`: JSON encoded array of menu item IDs
- `reservationId`: Reservation ID (optional)

### API Response Format

```typescript
interface CalendarData {
  year: number;
  month: number;
  day: number;
  firstSlotStartAt: string;     // "09:00" format
  availabilityIncrements: number; // minutes between slots
  hasPrev: boolean;
  hasNext: boolean;
  days: CalendarDay[];
  syncTokens?: Array<{
    staffId: number;
    syncToken: string;
  }>;
}

interface CalendarDay {
  year: number;
  month: number;
  day: number;
  weekday: string;              // "月", "火", etc.
  slots: TimeSlot[];
}

interface TimeSlot {
  staffId?: number;
  status: 'available' | 'reserved' | 'unavailable';
  startTime: Date;
  endTime: Date;
}
```

## Usage Examples

### Basic Reservation Calendar

```tsx
import { SlotCalendar } from 'slot-calendar';

function ReservationPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div>
      <SlotCalendar
        shopId={123}
        menuItemIds={[1]}
        onSlotSelect={setSelectedSlot}
      />
      
      {selectedSlot && (
        <div>
          Selected: {new Date(selectedSlot.startAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
```

### Staff-Specific Calendar

```tsx
function StaffCalendar({ staffId, staffName }) {
  const handleSlotSelect = (slotData) => {
    console.log(`Booking with ${staffName}:`, slotData);
  };

  return (
    <SlotCalendar
      shopId={123}
      menuItemIds={[1, 2]}
      staffId={staffId}
      isStaffSelected={true}
      onSlotSelect={handleSlotSelect}
    />
  );
}
```

### With Loading State

```tsx
function LoadingAwareCalendar() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading && <div>Loading slots...</div>}
      
      <SlotCalendar
        shopId={123}
        menuItemIds={[1]}
        onLoadingChange={setIsLoading}
      />
    </div>
  );
}
```

## Styling

The component comes with default styling that matches YoyakuDX:

```css
/* Override default styles */
.slot-calendar {
  --primary-color: #your-color;
  --border-color: #your-border;
}

/* Customize slot symbols */
.cal-time-slot td.available {
  color: #your-available-color;
}

.cal-time-slot td.reserved {
  color: #your-reserved-color;
}
```

## Slot Status Display

- **◎** (Available): User can click to book this slot
- **×** (Reserved): Slot is already booked
- **-** (Unavailable): Slot is not available (outside business hours, etc.)

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- High contrast support

## YoyakuDX Compatibility

This component is designed to be a drop-in replacement for YoyakuDX's original calendar implementation:

- Same API endpoints and data formats
- Compatible styling and layout
- Identical user interaction patterns
- Supports all YoyakuDX calendar features

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run Storybook
npm run storybook
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## License

MIT © [YoyakuDX](https://github.com/yoyakudx)

## Related Packages

- [`simple-slots`](https://github.com/yoyakudx/simple-slots) - Core slot calculation library
- [`simple-slots-multi`](https://github.com/yoyakudx/simple-slots-multi) - Multi-resource slot management