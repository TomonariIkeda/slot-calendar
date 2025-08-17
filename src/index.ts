// Components
export { SlotCalendar } from './components/SlotCalendar';

// Hooks
export { useSlotCalendar } from './hooks/useSlotCalendar';

// Data Providers
export { 
  StaticDataProvider,
  ApiDataProvider 
} from './providers';

export type { 
  DataProvider, 
  FetchSlotsParams, 
  DataProviderConfig
} from './providers';

// Types
export * from './types';

// Utils
export * from './utils/constants';
export * from './utils/dateUtils';

// Export styles
import './styles/index.css';