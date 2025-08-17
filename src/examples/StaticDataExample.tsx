import React from 'react';
import { SlotCalendar } from '../components/SlotCalendar';
import { StaticDataProvider } from '../providers/StaticDataProvider';

/**
 * Example: Using SlotCalendar with static data (no backend required)
 */
export const StaticDataExample: React.FC = () => {
  // Create a static data provider with 500ms mock delay
  const dataProvider = new StaticDataProvider(500);

  const handleSlotSelect = (slotData: any) => {
    console.log('Selected slot:', slotData);
    alert(`Selected slot: ${slotData.startAt}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Slot Calendar with Static Data</h1>
      <p>This example works without any backend API.</p>
      
      <SlotCalendar
        shopId={1}
        menuItemIds={[1, 2, 3]}
        dataProvider={dataProvider}
        onSlotSelect={handleSlotSelect}
      />
    </div>
  );
};