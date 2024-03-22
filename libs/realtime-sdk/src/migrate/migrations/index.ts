import { SchemaVersion } from '@realtime-sdk/schema-version/schema-version.enum';
import { Utils } from '@voiceflow/common';

import { Migration, Transform } from './types';
import migrateToV2_0 from './v2_0';
import migrateToV2_1 from './v2_1';
import migrateToV2_2 from './v2_2';
import migrateToV2_3 from './v2_3';
import migrateToV2_4 from './v2_4';
import migrateToV2_5 from './v2_5';
import migrateToV2_6 from './v2_6';
import migrateToV2_7 from './v2_7';
import migrateToV3_0 from './v3_0';
import migrateToV3_1 from './v3_1';
import migrateToV3_2 from './v3_2';
import migrateToV3_3 from './v3_3';
import migrateToV3_4 from './v3_4';
import migrateToV3_5 from './v3_5';
import migrateToV3_6 from './v3_6';
import migrateToV3_7 from './v3_7';
import migrateToV3_8 from './v3_8';
import migrateToV3_9 from './v3_9';
import migrateToV3_91 from './v3_91';
import migrateToV3_92 from './v3_92';
import migrateToV3_94 from './v3_94';
import migrateToV3_95 from './v3_95';
import migrateToV3_96 from './v3_96';
import migrateToV3_97 from './v3_97';
import migrateToV4_00 from './v4_00';
import migrateToV4_01 from './v4_01';
import migrateToV4_02 from './v4_02';
import migrateToV4_03 from './v4_03';
import migrateToV4_04 from './v4_04';
import migrateToV4_05 from './v4_05';
import migrateToV4_06 from './v4_06';
import migrateToV4_07 from './v4_07';
import migrateToV5_00 from './v5_00';
import migrateToV6_00 from './v6_00';
import migrateToV6_01 from './v6_01';
import migrateToV7_00 from './v7_00';
import migrateToV7_01 from './v7_01';
import migrateToV7_02 from './v7_02';

const migrationsMap: Record<SchemaVersion, Transform> = {
  [SchemaVersion.V1]: Utils.functional.noop,
  [SchemaVersion.V2]: migrateToV2_0,
  [SchemaVersion.V2_1]: migrateToV2_1,
  [SchemaVersion.V2_2]: migrateToV2_2,
  [SchemaVersion.V2_3]: migrateToV2_3,
  [SchemaVersion.V2_4]: migrateToV2_4,
  [SchemaVersion.V2_5]: migrateToV2_5,
  [SchemaVersion.V2_6]: migrateToV2_6,
  [SchemaVersion.V2_7]: migrateToV2_7,
  [SchemaVersion.V3_0]: migrateToV3_0,
  [SchemaVersion.V3_1]: migrateToV3_1,
  [SchemaVersion.V3_2]: migrateToV3_2,
  [SchemaVersion.V3_3]: migrateToV3_3,
  [SchemaVersion.V3_4]: migrateToV3_4,
  [SchemaVersion.V3_5]: migrateToV3_5,
  [SchemaVersion.V3_6]: migrateToV3_6,
  [SchemaVersion.V3_7]: migrateToV3_7,
  [SchemaVersion.V3_8]: migrateToV3_8,
  [SchemaVersion.V3_9]: migrateToV3_9,
  [SchemaVersion.V3_91]: migrateToV3_91,
  [SchemaVersion.V3_92]: migrateToV3_92,
  [SchemaVersion.V3_94]: migrateToV3_94,
  [SchemaVersion.V3_95]: migrateToV3_95,
  [SchemaVersion.V3_96]: migrateToV3_96,
  [SchemaVersion.V3_97]: migrateToV3_97,
  [SchemaVersion.V4_00]: migrateToV4_00,
  [SchemaVersion.V4_01]: migrateToV4_01,
  [SchemaVersion.V4_02]: migrateToV4_02,
  [SchemaVersion.V4_03]: migrateToV4_03,
  [SchemaVersion.V4_04]: migrateToV4_04,
  [SchemaVersion.V4_05]: migrateToV4_05,
  [SchemaVersion.V4_06]: migrateToV4_06,
  [SchemaVersion.V4_07]: migrateToV4_07,
  [SchemaVersion.V5_00]: migrateToV5_00,
  [SchemaVersion.V6_00]: migrateToV6_00,
  [SchemaVersion.V6_01]: migrateToV6_01,
  [SchemaVersion.V7_00]: migrateToV7_00,
  [SchemaVersion.V7_01]: migrateToV7_01,
  [SchemaVersion.V7_02]: migrateToV7_02,
};

const migrations = Object.entries(migrationsMap)
  .map(([key, value]) => [Number(key) as SchemaVersion, value] as const)
  .sort(([lhs], [rhs]) => lhs - rhs)
  .map<Migration>(([version, transform]) => ({ version, transform }));

export default migrations;
