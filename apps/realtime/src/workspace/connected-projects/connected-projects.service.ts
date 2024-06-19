import { Inject, Injectable } from '@nestjs/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { CacheService, SetStrategy } from '@/cache/cache.service';
import { HEARTBEAT_EXPIRE_TIMEOUT } from '@/constants';
import { LegacyService } from '@/legacy/legacy.service';

@Injectable()
export class WorkspaceConnectedProjectsService {
  private connectedProjectsCache: SetStrategy<typeof WorkspaceConnectedProjectsService.getCacheKey>;

  private static getCacheKey({ workspaceID }: { workspaceID: string }): string {
    return `workspaces:${workspaceID}:projects`;
  }

  constructor(
    @Inject(CacheService) private readonly cache: CacheService,
    @Inject(LegacyService) private readonly legacy: LegacyService
  ) {
    this.connectedProjectsCache = this.cache.setStrategyFactory({
      expire: HEARTBEAT_EXPIRE_TIMEOUT,
      keyCreator: WorkspaceConnectedProjectsService.getCacheKey,
    });
  }

  public async connectProject(workspaceID: string, projectID: string): Promise<void> {
    await this.connectedProjectsCache.add({ workspaceID }, projectID);
  }

  public async disconnectProject(workspaceID: string, projectID: string): Promise<void> {
    await this.connectedProjectsCache.remove({ workspaceID }, projectID);
  }

  public async getConnectedProjects(workspaceID: string): Promise<string[]> {
    return this.connectedProjectsCache.values({ workspaceID });
  }

  public async getConnectedViewersPerProject(
    workspaceID: string
  ): Promise<Record<string, Record<string, Realtime.Viewer[]>>> {
    const projectIDs = await this.getConnectedProjects(workspaceID);
    const projectsViewers = await Promise.all(
      projectIDs.map((projectID) => this.legacy.services.project.getConnectedViewersPerDiagram(projectID))
    );

    return Object.fromEntries(projectIDs.map((projectID, index) => [projectID, projectsViewers[index]]));
  }
}
