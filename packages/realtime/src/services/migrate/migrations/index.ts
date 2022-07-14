import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { Migration, Transform } from './types';
import migrateToV2 from './v2';
import migrateToV2_1 from './v2_1';

const migrationsMap: Record<Realtime.SchemaVersion, Transform> = {
  [Realtime.SchemaVersion.V1]: Utils.functional.noop,
  [Realtime.SchemaVersion.V2]: migrateToV2,
  [Realtime.SchemaVersion.V2_1]: migrateToV2_1,
};

const migrations = Object.entries(migrationsMap)
  .map(([key, value]) => [Number(key), value] as const)
  .sort(([lhs], [rhs]) => lhs - rhs)
  .map<Migration>(([version, transform]) => ({ version, transform }));

export default migrations;
