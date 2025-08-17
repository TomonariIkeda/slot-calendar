# Slot Calendar

A modern and flexible time slot calendar component for React applications. Features a clean table-based weekly view with customizable time slots for appointment booking, scheduling, and reservation systems.

## Features

- 📅 **Weekly Table Layout**: Clean table-based calendar display with week view
- 🎯 **Slot Status Display**: Clear visual indicators for available (◎), reserved (×), and unavailable (-) slots
- 📱 **Responsive Design**: Fully responsive design that works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Week Navigation**: Smooth navigation between weeks with previous/next buttons
- 🎨 **Customizable Styling**: Easy to customize with CSS variables and class names
- 🔧 **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- ⚡ **Performance Optimized**: Efficient rendering with skeleton loading and smooth transitions
- ♿ **Accessible**: Built with accessibility best practices including ARIA labels and keyboard navigation
- 🌐 **Internationalization Ready**: Support for multiple locales and date formats

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

The calendar component is designed to work with your backend API. It expects a `GET /api/slots` endpoint that returns calendar data.

### Request Parameters

- `shopId`: Unique identifier for the location/shop
- `staffId`: Staff member ID (optional)
- `year`, `month`, `day`: Calendar date for the week
- `menuItemIds`: JSON encoded array of service/menu item IDs
- `reservationId`: Existing reservation ID for editing (optional)

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

The component comes with clean, modern default styling that can be easily customized:

```css
/* Override default styles */
.slot-calendar {
  --primary-color: #1976d2;
  --border-color: #e0e0e0;
  --background-color: #ffffff;
}

/* Customize slot status colors */
.cal-time-slot td.available {
  color: #d32f2f; /* Red for available */
}

.cal-time-slot td.reserved {
  color: #757575; /* Gray for reserved */
}

.cal-time-slot td.off {
  color: #bdbdbd; /* Light gray for unavailable */
}
```

## Slot Status Display

- **◎** (Available): User can click to book this slot
- **×** (Reserved): Slot is already booked
- **-** (Unavailable): Slot is not available (outside business hours, etc.)

## Accessibility

The component is built with accessibility as a priority:

- ✅ Full keyboard navigation support
- ✅ Comprehensive ARIA labels for screen readers
- ✅ Focus management and visual indicators
- ✅ High contrast mode support
- ✅ Semantic HTML structure
- ✅ Responsive text sizing

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Run Storybook for component development
npm run storybook

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Testing

The project includes comprehensive test coverage:

- Unit tests for all components and hooks
- Integration tests for user interactions
- Accessibility testing
- Visual regression testing with Storybook

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ iOS Safari
- ✅ Android Chrome

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Tomonari Ikeda](https://github.com/TomonariIkeda)

## Author

**Tomonari Ikeda**
- GitHub: [@TomonariIkeda](https://github.com/TomonariIkeda)

## Acknowledgments

- Built with React and TypeScript
- Styled with modern CSS
- Tested with Jest and React Testing Library
- Documented with Storybook