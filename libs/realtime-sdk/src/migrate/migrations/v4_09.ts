import { entityToLegacySlot } from '@realtime-sdk/adapters';

import { CMSMigrationData, Transform } from './types';

// create entities and variants for legacy version slots
const migrateToV4_09: Transform = ({ version, cms = {} as CMSMigrationData }, { creatorID }) => {
  if (!cms.assistant) return;

  const entityWithVariants = entityToLegacySlot.mapToDB(version.platformData.slots, {
    assistantID: cms.assistant.id,
    creatorID,
    environmentID: cms.assistant.activeEnvironmentID,
  });

  cms.entities.push(...entityWithVariants.map(({ entity }) => entity));
  cms.entityVariants.push(...entityWithVariants.flatMap(({ variants }) => variants));
};

export default migrateToV4_09;
