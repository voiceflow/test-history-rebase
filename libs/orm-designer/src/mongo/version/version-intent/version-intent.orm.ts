import type { Primary } from '@mikro-orm/core';
import type { BaseModels } from '@voiceflow/base-types';

import { MongoAtomicSubResourceArrayORM } from '@/mongo/common';

import type { VersionEntity } from '../version.entity';
import { VersionORM } from '../version.orm';

export class VersionIntentORM extends MongoAtomicSubResourceArrayORM<VersionORM, BaseModels.Intent, 'key'>(VersionORM, {
  id: 'key',
  path: `${VersionORM.PLATFORM_DATA_PATH}.intents`,
}) {
  async find<Intent extends BaseModels.Intent>(versionID: Primary<VersionEntity>): Promise<Intent[]> {
    const platformData = await this.orm.findOneOrFailPlatformData(versionID);

    return platformData.intents;
  }
}
