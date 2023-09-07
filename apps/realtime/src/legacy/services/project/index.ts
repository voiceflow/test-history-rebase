import { BaseModels, BaseProject, BaseVersion } from '@voiceflow/base-types';
import { AnyRecord, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import _ from 'lodash';
import { Optional } from 'utility-types';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../../constants';
import { AbstractControl, ControlOptions } from '../../control';
import AccessCache from '../utils/accessCache';
import ProjectMemberService from './member';

const CANVAS_UPDATE_THROTTLE_TIME = 30 * 1000; // 30 seconds

class ProjectService extends AbstractControl {
  private static getCanvasUpdatedDebounceKey({ projectID }: { projectID: string }): string {
    return `projects:${projectID}:canvas-updated-throttle`;
  }

  private static getConnectedDiagramsKey({ projectID }: { projectID: string }): string {
    return `projects:${projectID}:diagrams`;
  }

  // needs this to throttle canvas updates on multiple instances
  private updatedThrottleCache = this.clients.cache.createKeyValue({
    expire: CANVAS_UPDATE_THROTTLE_TIME / 1000,
    keyCreator: ProjectService.getCanvasUpdatedDebounceKey,
  });

  private connectedDiagramsCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: ProjectService.getConnectedDiagramsKey,
  });

  public access = new AccessCache('project', this.clients, this.services);

  public member: ProjectMemberService;

  constructor(options: ControlOptions) {
    super(options);

    this.member = new ProjectMemberService(options);
  }

  public async connectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.connectedDiagramsCache.add({ projectID }, diagramID);
  }

  public async disconnectDiagram(projectID: string, diagramID: string): Promise<void> {
    await this.connectedDiagramsCache.remove({ projectID }, diagramID);
  }

  public async getConnectedDiagrams(projectID: string): Promise<string[]> {
    return this.connectedDiagramsCache.values({ projectID });
  }

  public async getConnectedDiagramsSize(projectID: string): Promise<number> {
    return this.connectedDiagramsCache.size({ projectID });
  }

  public async getConnectedViewersPerDiagram(projectID: string): Promise<Record<string, Realtime.Viewer[]>> {
    const diagramIDs = await this.services.project.getConnectedDiagrams(projectID);
    const diagramsViewers = await Promise.all(diagramIDs.map((diagramID) => this.services.diagram.getConnectedViewers(diagramID)));

    return Object.fromEntries(diagramIDs.map((diagramID, index) => [diagramID, diagramsViewers[index]]));
  }

  public async get<P extends AnyRecord, M extends AnyRecord>(creatorID: number, projectID: string): Promise<BaseModels.Project.Model<P, M>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.get(projectID);
  }

  public async getPlatform(projectID: string): Promise<Platform.Constants.PlatformType> {
    const { type, platform } = await this.models.project.getPlatformAndType(projectID);

    return Realtime.legacyPlatformToProjectType(platform, type).platform;
  }

  public async getCreator(
    creatorID: number,
    projectID: string,
    versionID: string
  ): Promise<{
    project: BaseProject.Project;
    version: BaseVersion.Version;
    diagrams: BaseModels.Diagram.Model[];
    variableStates: BaseModels.VariableState.Model[];
  }> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.getCreator(projectID, versionID);
  }

  public async getAll(creatorID: number, workspaceID: string): Promise<Realtime.DBProject[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.list(workspaceID);
  }

  public async create(creatorID: number, templateID: string, data: Realtime.NewProject): Promise<Realtime.DBProject> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.platform<Realtime.DBProject>(Realtime.legacyPlatformToProjectType(data.platform).platform).duplicate(templateID, data);
  }

  public async duplicate(
    creatorID: number,
    projectID: string,
    data: Optional<Pick<Realtime.DBProject, 'teamID' | 'name' | '_version' | 'platform'>, 'name' | 'platform'>
  ): Promise<Realtime.AnyDBProject> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const platform = data.platform ? Realtime.legacyPlatformToProjectType(data.platform).platform : await this.getPlatform(projectID);

    // do not pass platform to duplicate to do not migrate projects from "chat" to "voice"
    return client.project.platform<Realtime.AnyDBProject>(platform).duplicate(projectID, Utils.object.omit(data, ['platform']));
  }

  public async patch(creatorID: number, projectID: string, { _id, ...data }: Partial<Realtime.DBProject>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.project.update(projectID, data);
  }

  public async patchPlatformData(creatorID: number, projectID: string, data: Partial<AnyRecord>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.project.updatePlatformData(projectID, data);
  }

  public async delete(creatorID: number, projectID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.project.deleteV2(projectID);
  }

  public async toggleWorkspaceProjectsAiAssistOff(workspaceID: string): Promise<void> {
    const decodedWorkspaceID = this.clients.teamHashids.decode(workspaceID)[0];

    await this.models.project.updateManyByWorkspaceID(decodedWorkspaceID, { 'aiAssistSettings.aiPlayground': false });
  }

  // eslint-disable-next-line you-dont-need-lodash-underscore/throttle
  public setUpdatedBy = _.throttle(async (projectID: string, creatorID: number) => {
    try {
      // skipping if the canvas was updated in another instance
      if (await this.updatedThrottleCache.get({ projectID })) return;

      await Promise.all([
        this.models.project.updateByID(projectID, { updatedAt: new Date(), updatedBy: creatorID }),
        this.updatedThrottleCache.set({ projectID }, `${creatorID}`),
      ]);
    } catch (error) {
      this.log.warn(error, "couldn't set project updated by");
    }
  }, CANVAS_UPDATE_THROTTLE_TIME);
}

export default ProjectService;
