import { Inject } from '@nestjs/common';
import { AnyRecord, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Optional } from 'utility-types';

import { CreatorService } from '@/creator/creator.service';

import { ProjectPlatformService } from '../platform/project-platform.service';

// TODO: delete and replace calls once we move to new project service and entity
export class ProjectLegacyService {
  constructor(
    @Inject(CreatorService)
    private readonly creator: CreatorService,
    @Inject(ProjectPlatformService)
    private readonly projectPlatform: ProjectPlatformService
  ) {}

  public async get(creatorID: number, projectID: string) {
    if (!this.creator) throw new Error('no client found');
    const client = await this.creator?.getClientByUserID(creatorID);
    return client.project.get(projectID);
  }

  public async patchPlatformData(creatorID: number, projectID: string, data: Partial<AnyRecord>): Promise<void> {
    const client = await this.creator.getClientByUserID(creatorID);
    await client.project.updatePlatformData(projectID, data);
  }

  public async patch(creatorID: number, projectID: string, { _id, ...data }: Partial<Realtime.DBProject>): Promise<void> {
    const client = await this.creator.getClientByUserID(creatorID);
    await client.project.update(projectID, data);
  }

  public async getPlatform(creatorID: number, projectID: string): Promise<Platform.Constants.PlatformType> {
    const { type, platform } = await this.get(creatorID, projectID);
    return Realtime.legacyPlatformToProjectType(platform, type).platform;
  }

  public async duplicate(
    creatorID: number,
    projectID: string,
    data: Optional<Pick<Realtime.DBProject, 'teamID' | 'name' | '_version' | 'platform'>, 'name' | 'platform'>
  ): Promise<Realtime.AnyDBProject> {
    const platform = data.platform ? Realtime.legacyPlatformToProjectType(data.platform).platform : await this.getPlatform(creatorID, projectID);
    const client = await this.projectPlatform.getPlatformClientByUser(creatorID, platform);

    // do not pass platform to duplicate to do not migrate projects from "chat" to "voice"
    return client.duplicate(projectID, Utils.object.omit(data, ['platform']));
  }
}
