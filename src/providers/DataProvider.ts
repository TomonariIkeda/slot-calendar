import { CalendarData } from '../types';

/**
 * Data provider interface for fetching calendar slot data
 */
export interface DataProvider {
  /**
   * Fetch calendar data for the specified date and parameters
   */
  fetchSlots(params: FetchSlotsParams): Promise<CalendarData>;
}

export interface FetchSlotsParams {
  shopId: number;
  year: number;
  month: number;
  day: number;
  menuItemIds?: number[];
  staffId?: number;
  reservationId?: number;
}

/**
 * Configuration for creating a data provider
 */
export interface DataProviderConfig {
  apiEndpoint?: string;
  headers?: Record<string, string>;
  mockDelay?: number;
}