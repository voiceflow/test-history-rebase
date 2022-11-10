import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Optional } from 'utility-types';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../../constants';
import { AbstractControl, ControlOptions } from '../../control';
import AccessCache from '../utils/accessCache';
import ProjectMemberService from './member';

class ProjectService extends AbstractControl {
  private static getConnectedDiagramsKey({ projectID }: { projectID: string }): string {
    return `projects:${projectID}:diagrams`;
  }

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

  public async get<P extends AnyRecord, M extends AnyRecord>(creatorID: number, projectID: string): Promise<BaseModels.Project.Model<P, M>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.get(projectID);
  }

  public async getPlatform(projectID: string): Promise<Platform.Constants.PlatformType> {
    const { type, platform } = await this.models.project.getPlatformAndType(projectID);

    return Realtime.legacyPlatformToProjectType(platform, type).platform;
  }

  public async getCreator<
    P extends BaseModels.Project.Model<any, any> = BaseModels.Project.Model<AnyRecord, AnyRecord>,
    V extends BaseModels.Version.Model<any, any, string> = BaseModels.Version.Model<BaseModels.Version.PlatformData>,
    D extends BaseModels.Diagram.Model<any> = BaseModels.Diagram.Model,
    VS extends BaseModels.VariableState.Model = BaseModels.VariableState.Model
  >(
    creatorID: number,
    projectID: string,
    versionID: string
  ): Promise<{
    project: P;
    version: V;
    diagrams: D[];
    variableStates: VS[];
  }> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.getCreator(projectID, versionID);
  }

  public async getAll(creatorID: number, workspaceID: string): Promise<Realtime.DBProject[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project.list(workspaceID);
  }

  public async create(
    creatorID: number,
    templateID: string,
    data: Realtime.NewProject,
    params: { channel: string; language?: string; onboarding: boolean }
  ): Promise<Realtime.DBProject> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.project
      .platform<Realtime.DBProject>(Realtime.legacyPlatformToProjectType(data.platform).platform)
      .duplicate(templateID, data, params);
  }

  public async importFromFile(
    creatorID: number,
    workspaceID: string,
    { data, vfVersion }: { data: string; vfVersion: number }
  ): Promise<Realtime.DBProject> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const importJSON = JSON.parse(data) as {
      project: BaseModels.Project.Model<any, any>;
      version: BaseModels.Version.Model<any>;
      diagrams: Record<string, BaseModels.Diagram.Model<any>>;
    };

    if (importJSON.project && typeof importJSON.project === 'object') {
      importJSON.project._version = vfVersion;
    }

    return client.version.import(workspaceID, importJSON);
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
}

export default ProjectService;
