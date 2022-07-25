import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { Migration, Transform } from './types';
import migrateToV2_0 from './v2_0';
import migrateToV2_1 from './v2_1';
import migrateToV2_2 from './v2_2';
import migrateToV2_3 from './v2_3';

const migrationsMap: Record<Realtime.SchemaVersion, Transform> = {
  [Realtime.SchemaVersion.V1]: Utils.functional.noop,
  [Realtime.SchemaVersion.V2]: migrateToV2_0,
  [Realtime.SchemaVersion.V2_1]: migrateToV2_1,
  [Realtime.SchemaVersion.V2_2]: migrateToV2_2,
  [Realtime.SchemaVersion.V2_3]: migrateToV2_3,
};

const migrations = Object.entries(migrationsMap)
  .map(([key, value]) => [Number(key), value] as const)
  .sort(([lhs], [rhs]) => lhs - rhs)
  .map<Migration>(([version, transform]) => ({ version, transform }));

export default migrations;
