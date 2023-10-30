import type { Primary } from '@mikro-orm/core';
import type { BaseModels } from '@voiceflow/base-types';

import { MongoAtomicSubResourceArrayORM } from '@/mongo/common';

import type { VersionEntity } from '../version.entity';
import { VersionORM } from '../version.orm';

export class VersionSlotORM extends MongoAtomicSubResourceArrayORM<VersionORM, BaseModels.Slot, 'key'>(VersionORM, {
  id: 'key',
  path: `${VersionORM.PLATFORM_DATA_PATH}.slots`,
}) {
  async find<Slot extends BaseModels.Slot>(versionID: Primary<VersionEntity>): Promise<Slot[]> {
    const platformData = await this.orm.findOneOrFailPlatformData(versionID);

    return platformData.slots;
  }
}
