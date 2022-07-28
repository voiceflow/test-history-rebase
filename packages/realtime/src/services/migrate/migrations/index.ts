import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { Migration, Transform } from './types';
import migrateToV2_0 from './v2_0';
import migrateToV2_1 from './v2_1';
import migrateToV2_2 from './v2_2';
import migrateToV2_3 from './v2_3';
import migrateToV2_4 from './v2_4';
import migrateToV2_5 from './v2_5';
import migrateToV2_6 from './v2_6';
import migrateToV2_7 from './v2_7';

const migrationsMap: Record<Realtime.SchemaVersion, Transform> = {
  [Realtime.SchemaVersion.V1]: Utils.functional.noop,
  [Realtime.SchemaVersion.V2]: migrateToV2_0,
  [Realtime.SchemaVersion.V2_1]: migrateToV2_1,
  [Realtime.SchemaVersion.V2_2]: migrateToV2_2,
  [Realtime.SchemaVersion.V2_3]: migrateToV2_3,
  [Realtime.SchemaVersion.V2_4]: migrateToV2_4,
  [Realtime.SchemaVersion.V2_5]: migrateToV2_5,
  [Realtime.SchemaVersion.V2_6]: migrateToV2_6,
  [Realtime.SchemaVersion.V2_7]: migrateToV2_7,
};

const migrations = Object.entries(migrationsMap)
  .map(([key, value]) => [Number(key), value] as const)
  .sort(([lhs], [rhs]) => lhs - rhs)
  .map<Migration>(([version, transform]) => ({ version, transform }));

export default migrations;
