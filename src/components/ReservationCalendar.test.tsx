import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationCalendar } from './ReservationCalendar';
import { TimeSlot } from '../types';

const mockSlots: TimeSlot[] = [
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
  {
    id: '3',
    startTime: new Date('2024-01-15T11:00:00'),
    endTime: new Date('2024-01-15T11:30:00'),
    available: false,
  },
];

describe('ReservationCalendar', () => {
  it('renders without crashing', () => {
    render(<ReservationCalendar availableSlots={mockSlots} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('displays time slots correctly', () => {
    render(<ReservationCalendar availableSlots={mockSlots} />);
    
    expect(screen.getByText('09:00 - 09:30')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 10:30')).toBeInTheDocument();
    expect(screen.getByText('11:00 - 11:30')).toBeInTheDocument();
  });

  it('handles slot selection', () => {
    const onSlotSelect = jest.fn();
    render(
      <ReservationCalendar 
        availableSlots={mockSlots} 
        onSlotSelect={onSlotSelect}
      />
    );

    const firstSlot = screen.getByText('09:00 - 09:30').closest('button');
    fireEvent.click(firstSlot!);

    expect(onSlotSelect).toHaveBeenCalledWith(mockSlots[0]);
  });

  it('disables unavailable slots', () => {
    render(<ReservationCalendar availableSlots={mockSlots} />);
    
    const unavailableSlot = screen.getByText('11:00 - 11:30').closest('button');
    expect(unavailableSlot).toBeDisabled();
  });


  it('handles navigation', () => {
    render(<ReservationCalendar availableSlots={mockSlots} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });
    
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
  });

  it('applies disabled state correctly', () => {
    render(<ReservationCalendar availableSlots={mockSlots} disabled={true} />);
    
    const calendar = screen.getByRole('button', { name: /previous/i }).closest('.reservation-calendar');
    expect(calendar).toHaveClass('reservation-calendar--disabled');
  });
});