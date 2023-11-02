import type { Primary } from '@mikro-orm/core';
import type { AnyRecord } from '@voiceflow/common';

import { Atomic, MongoAtomicORM } from '../common';
import { ProjectEntity } from './project.entity';

export class ProjectORM extends MongoAtomicORM(ProjectEntity) {
  static PLATFORM_DATA_PATH = 'platformData' as const;

  async patchOnePlatformData(id: Primary<ProjectEntity>, data: AnyRecord) {
    await this.atomicUpdateOne(
      id,
      Object.entries(data).map(([key, value]) => Atomic.Set([{ path: [ProjectORM.PLATFORM_DATA_PATH, key], value }]))
    );
  }

  async findOneOrFailPlatformData<T extends AnyRecord>(id: Primary<ProjectEntity>) {
    const { platformData } = await this.findOneOrFail(id, { fields: [ProjectORM.PLATFORM_DATA_PATH] });

    return platformData as T;
  }
}
