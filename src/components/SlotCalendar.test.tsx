import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SlotCalendar } from './SlotCalendar';
import { CalendarData, SlotStatus } from '../types';

// Mock the useSlotCalendar hook
const mockCalendarData: CalendarData = {
  year: 2024,
  month: 8,
  day: 19,
  firstSlotStartAt: '09:00',
  availabilityIncrements: 30,
  hasPrev: true,
  hasNext: true,
  days: [
    {
      year: 2024,
      month: 8,
      day: 19,
      weekday: '月',
      slots: [
        {
          staffId: 1,
          status: SlotStatus.AVAILABLE,
          startTime: new Date(2024, 7, 19, 9, 0),
          endTime: new Date(2024, 7, 19, 9, 30),
        },
        {
          staffId: 1,
          status: SlotStatus.RESERVED,
          startTime: new Date(2024, 7, 19, 9, 30),
          endTime: new Date(2024, 7, 19, 10, 0),
        },
      ],
    },
  ],
  syncToken: 'mock-sync-token',
};

const mockUseSlotCalendar = {
  currentDate: new Date(2024, 7, 19),
  calendarData: mockCalendarData,
  isLoading: false,
  error: null,
  loadSlots: jest.fn(),
  navigateToPrevWeek: jest.fn(),
  navigateToNextWeek: jest.fn(),
};

jest.mock('../hooks/useSlotCalendar', () => ({
  useSlotCalendar: () => mockUseSlotCalendar,
}));

describe('SlotCalendar', () => {
  const defaultProps = {
    shopId: 123,
    menuItemIds: [1, 2],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SlotCalendar {...defaultProps} />);
    expect(screen.getByText('前の週')).toBeInTheDocument();
    expect(screen.getByText('次の週')).toBeInTheDocument();
  });

  it('displays calendar month header', async () => {
    render(<SlotCalendar {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('2024年8月')).toBeInTheDocument();
    });
  });

  it('displays weekday headers', async () => {
    render(<SlotCalendar {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('月')).toBeInTheDocument();
    });
  });

  it('calls onSlotSelect when available slot is clicked', async () => {
    const onSlotSelect = jest.fn();
    render(<SlotCalendar {...defaultProps} onSlotSelect={onSlotSelect} />);
    
    await waitFor(() => {
      const availableSlot = screen.getByText('◎');
      expect(availableSlot).toBeInTheDocument();
    });

    const availableSlot = screen.getByText('◎');
    fireEvent.click(availableSlot);

    expect(onSlotSelect).toHaveBeenCalledWith({
      startAt: expect.any(String),
      staff: {
        id: 1,
        nameDisplay: 'No Preference',
      },
      syncToken: 'mock-sync-token',
    });
  });

  it('does not call onSlotSelect for reserved slots', async () => {
    const onSlotSelect = jest.fn();
    render(<SlotCalendar {...defaultProps} onSlotSelect={onSlotSelect} />);
    
    await waitFor(() => {
      const reservedSlot = screen.getByText('×');
      expect(reservedSlot).toBeInTheDocument();
    });

    const reservedSlot = screen.getByText('×');
    fireEvent.click(reservedSlot);

    expect(onSlotSelect).not.toHaveBeenCalled();
  });

  it('disables navigation when disabled prop is true', () => {
    render(<SlotCalendar {...defaultProps} disabled={true} />);
    
    const prevButton = screen.getByText('前の週').closest('button');
    const nextButton = screen.getByText('次の週').closest('button');
    
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('calls navigation functions when buttons are clicked', () => {
    render(<SlotCalendar {...defaultProps} />);
    
    const prevButton = screen.getByText('前の週').closest('button');
    const nextButton = screen.getByText('次の週').closest('button');
    
    fireEvent.click(prevButton!);
    expect(mockUseSlotCalendar.navigateToPrevWeek).toHaveBeenCalled();
    
    fireEvent.click(nextButton!);
    expect(mockUseSlotCalendar.navigateToNextWeek).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    mockUseSlotCalendar.isLoading = true;
    render(<SlotCalendar {...defaultProps} />);
    
    expect(screen.getByRole('table')).toHaveStyle({ opacity: '0.5' });
    expect(document.querySelector('.progress-bar')).toBeInTheDocument();
  });

  it('shows error message', () => {
    mockUseSlotCalendar.error = 'Test error message';
    render(<SlotCalendar {...defaultProps} />);
    
    expect(screen.getByText('エラーが発生しました: Test error message')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SlotCalendar {...defaultProps} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('slot-calendar', 'custom-class');
  });

  it('calls loadSlots with correct parameters', () => {
    render(
      <SlotCalendar
        {...defaultProps}
        staffId={456}
        isStaffSelected={true}
        reservationId={789}
      />
    );
    
    expect(mockUseSlotCalendar.loadSlots).toHaveBeenCalledWith(
      [1, 2],
      456,
      true,
      123,
      789
    );
  });
});