export const SLOT_ARRAY_INDEX = {
  STAFF_ID: 0,
  SLOTS_STATUS: 1,
} as const;

export const SLOTS_STATUS = {
  UNAVAILABLE: 'unavailable',
  AVAILABLE: 'available', 
  RESERVED: 'reserved'
} as const;

export const SLOT_SYMBOLS = {
  [SLOTS_STATUS.UNAVAILABLE]: '-',
  [SLOTS_STATUS.AVAILABLE]: '◎', 
  [SLOTS_STATUS.RESERVED]: '×'
} as const;

export const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'] as const;
export const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;