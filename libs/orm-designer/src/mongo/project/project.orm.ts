import type { Primary } from '@mikro-orm/core';
import type { AnyRecord } from '@voiceflow/common';

import type { MutableEntityData } from '@/types';

import { Atomic, MongoAtomicORM } from '../common';
import { ProjectEntity } from './project.entity';

export class ProjectORM extends MongoAtomicORM(ProjectEntity) {
  static PLATFORM_DATA_PATH = 'platformData' as const;

  async getPlatformAndType(projectID: string): Promise<{ type?: string; platform?: string }> {
    const project = await this.findOne(projectID);
    return { platform: project?.platform, type: project?.type };
  }

  async getIDsByWorkspaceID(workspaceID: number): Promise<string[]> {
    const result = await this.find({ teamID: workspaceID }, { fields: ['_id'] });
    return result.map(({ _id }) => _id!.toJSON());
  }

  public async updateManyByWorkspaceID(
    workspaceID: number,
    data: Omit<MutableEntityData<ProjectEntity>, '_id' | 'devVersion' | 'liveVersion' | 'previewVersion'>
  ): Promise<void> {
    await this.nativeUpdate({ teamID: workspaceID }, data);
  }

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
