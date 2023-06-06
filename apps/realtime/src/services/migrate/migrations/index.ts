import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { Migration, Transform } from './types';

const migrationsMap: Record<Realtime.SchemaVersion, Transform> = {
  [Realtime.SchemaVersion.V5]: Utils.functional.noop,
};

const migrations = Object.entries(migrationsMap)
  .map(([key, value]) => [Number(key), value] as const)
  .sort(([lhs], [rhs]) => lhs - rhs)
  .map<Migration>(([version, transform]) => ({ version, transform }));

export default migrations;
