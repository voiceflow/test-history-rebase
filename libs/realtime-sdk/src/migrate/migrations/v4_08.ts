import { entityToLegacySlot } from '@realtime-sdk/adapters';

import { Transform } from './types';

// create entities and variants for legacy version slots
const migrateToV4_08: Transform = ({ version }, { assistant, creatorID }) => {
  entityToLegacySlot.mapToDB(version.platformData.slots, { assistantID: assistant.id, creatorID });
};

export default migrateToV4_08;
