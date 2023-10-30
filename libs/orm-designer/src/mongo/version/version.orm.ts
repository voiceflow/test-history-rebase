import type { Primary } from '@mikro-orm/core';
import type { AnyRecord } from '@voiceflow/common';

import { MongoAtomicORM } from '../common';
import { VersionEntity } from './version.entity';

export class VersionORM extends MongoAtomicORM(VersionEntity) {
  static PLATFORM_DATA_PATH = 'platformData' as const;

  async findOneOrFailPlatformData<T extends AnyRecord>(id: Primary<VersionEntity>) {
    const { platformData } = await this.findOneOrFail(id, { fields: [VersionORM.PLATFORM_DATA_PATH] });

    return platformData as T;
  }
}
