import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Optional } from 'utility-types';

import { AbstractControl, ControlOptions } from '../../control';
import ProjectMemberService from './member';

class ProjectService extends AbstractControl {
  private static getCanReadKey({ projectID, creatorID }: { projectID: string; creatorID: number }): string {
    return `projects:${projectID}:can-read:${creatorID}`;
  }

  private static getConnectedDiagramsKey({ projectID }: { projectID: string }): string {
    return `projects:${projectID}:diagrams`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: ProjectService.getCanReadKey,
  });

  private connectedDiagramsCache = this.clients.cache.createSet({ keyCreator: ProjectService.getConnectedDiagramsKey });

  public member: ProjectMemberService;

  constructor(options: ControlOptions) {
    super(options);

    this.member = new ProjectMemberService(options);
  }

  public async canRead(creatorID: number, projectID: string): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ projectID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.project.canRead(creatorID, projectID);

    await this.canReadCache.set({ projectID, creatorID }, canRead);

    return canRead;
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

  public async getPlatform(creatorID: number, projectID: string): Promise<VoiceflowConstants.PlatformType> {
    const project = await this.get(creatorID, projectID).then(Realtime.Adapters.projectAdapter.fromDB);

    return project.platform;
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

    return client.project.platform<Realtime.DBProject>(data.platform as VoiceflowConstants.PlatformType).duplicate(templateID, data, params);
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
      // eslint-disable-next-line no-underscore-dangle
      importJSON.project._version = vfVersion;
    }

    return client.version.import(workspaceID, importJSON);
  }

  public async duplicate(
    creatorID: number,
    projectID: string,
    data: Optional<Pick<Realtime.DBProject, 'teamID' | 'name' | '_version'>, 'name'>
  ): Promise<Realtime.AnyDBProject> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const platform = await this.getPlatform(creatorID, projectID);

    return client.project.platform<Realtime.AnyDBProject>(platform).duplicate(projectID, data);
  }

  public async patch(creatorID: number, projectID: string, { _id, ...data }: Partial<Realtime.DBProject>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.project.update(projectID, data);
  }

  public async delete(creatorID: number, projectID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.project.deleteV2(projectID);
  }
}

export default ProjectService;
