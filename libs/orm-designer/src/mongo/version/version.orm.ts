import type { Primary } from '@mikro-orm/core';
import type { AnyRecord } from '@voiceflow/common';
import type { VersionSettings } from '@voiceflow/dtos';

import { Atomic, MongoAtomicORM } from '../common';
import { VersionEntity } from './version.entity';

export class VersionORM extends MongoAtomicORM(VersionEntity) {
  static SETTINGS_PATH = 'settings' as const satisfies keyof VersionEntity;

  static PLATFORM_DATA_PATH = 'platformData' as const satisfies keyof VersionEntity;

  async updateOneSettings(id: Primary<VersionEntity>, update: Partial<VersionSettings>) {
    await this.atomicUpdateOne(
      id,
      Object.entries(update).map(([key, value]) => Atomic.Set([{ path: [VersionORM.SETTINGS_PATH, key], value }]))
    );
  }

  async patchOnePlatformData(id: Primary<VersionEntity>, data: AnyRecord) {
    await this.atomicUpdateOne(
      id,
      Object.entries(data).map(([key, value]) => Atomic.Set([{ path: [VersionORM.PLATFORM_DATA_PATH, key], value }]))
    );
  }

  async findOneOrFailPlatformData<T extends AnyRecord>(id: Primary<VersionEntity>) {
    const { platformData } = await this.findOneOrFail(id, { fields: [VersionORM.PLATFORM_DATA_PATH] });

    return platformData as T;
  }
}
