import type { Primary } from '@mikro-orm/core';
import type { AnyRecord } from '@voiceflow/common';

import { Atomic, MongoAtomicORM } from '../common';
import { ProjectEntity } from './project.entity';
import { ProjectJSONAdapter } from './project-json.adapter';

export class ProjectORM extends MongoAtomicORM<ProjectEntity> {
  Entity = ProjectEntity;

  jsonAdapter = ProjectJSONAdapter;

  static PLATFORM_DATA_PATH = 'platformData' as const;

  async getWorkspaceID(projectID: string) {
    const { teamID } = await this.findOneOrFail(projectID, { fields: ['teamID'] });

    return teamID;
  }

  async getPlatformAndType(projectID: string): Promise<{ type?: string; platform?: string }> {
    const project = await this.findOne(projectID);

    return { platform: project?.platform, type: project?.type };
  }

  async getIDsByWorkspaceID(workspaceID: number): Promise<string[]> {
    const result = await this.find({ teamID: workspaceID }, { fields: ['_id'] });

    return result.map(({ _id }) => _id.toJSON());
  }

  async deleteManyByWorkspaceID(workspaceID: number) {
    await this.delete({ teamID: workspaceID });
  }

  async getVersionAndWorkspaceID(projectID: string): Promise<{ devVersion?: string; workspaceID: number }> {
    const { devVersion, teamID } = await this.findOneOrFail(projectID, { fields: ['devVersion', 'teamID'] });

    return { devVersion: devVersion?.toString(), workspaceID: teamID };
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
