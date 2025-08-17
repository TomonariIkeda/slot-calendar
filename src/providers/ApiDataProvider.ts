import { DataProvider, FetchSlotsParams, DataProviderConfig } from './DataProvider';
import { CalendarData } from '../types';

/**
 * API data provider that fetches calendar data from a backend API
 */
export class ApiDataProvider implements DataProvider {
  private apiEndpoint: string;
  private headers: Record<string, string>;

  constructor(config: DataProviderConfig = {}) {
    this.apiEndpoint = config.apiEndpoint || '/api/slots';
    this.headers = config.headers || {};
  }

  async fetchSlots(params: FetchSlotsParams): Promise<CalendarData> {
    const queryParams = new URLSearchParams({
      shopId: params.shopId.toString(),
      year: params.year.toString(),
      month: params.month.toString(),
      day: params.day.toString()
    });

    // Add optional parameters
    if (params.menuItemIds && params.menuItemIds.length > 0) {
      queryParams.append('menuItemIds', JSON.stringify(params.menuItemIds));
    }
    if (params.staffId) {
      queryParams.append('staffId', params.staffId.toString());
    }
    if (params.reservationId) {
      queryParams.append('reservationId', params.reservationId.toString());
    }

    const url = `${this.apiEndpoint}?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: CalendarData = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch slots from API:', error);
      throw error;
    }
  }

  /**
   * Update API endpoint
   */
  setApiEndpoint(endpoint: string) {
    this.apiEndpoint = endpoint;
  }

  /**
   * Update request headers
   */
  setHeaders(headers: Record<string, string>) {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Clear specific header
   */
  clearHeader(key: string) {
    delete this.headers[key];
  }
}