import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl, ControlOptions } from '../../control';
import WorkspaceMemberService from './member';

class WorkspaceService extends AbstractControl {
  private static getCanReadKey({ workspaceID, creatorID }: { workspaceID: string; creatorID: number }): string {
    return `workspace:${workspaceID}:can-read:${creatorID}`;
  }

  public member: WorkspaceMemberService;

  constructor(options: ControlOptions) {
    super(options);

    this.member = new WorkspaceMemberService(options);
  }

  private canReadCache = this.clients.cache.createKeyValue({
    expire: 60,
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: WorkspaceService.getCanReadKey,
  });

  public async canRead(creatorID: number, workspaceID: string): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ workspaceID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.workspace.canRead(creatorID, workspaceID);

    await this.canReadCache.set({ workspaceID, creatorID }, canRead);

    return canRead;
  }

  public async get(creatorID: number, workspaceID: string): Promise<Realtime.DBWorkspace> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.get(workspaceID);
  }

  public async getAll(creatorID: number): Promise<Realtime.DBWorkspace[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.list();
  }

  public async create(creatorID: number, { name, image }: { name: string; image?: string }): Promise<Realtime.DBWorkspace> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.create({ name, image });
  }

  public async checkout(creatorID: number, data: Realtime.workspace.CheckoutWorkspacePayload): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.checkout(data.workspaceID, { ...Utils.object.omit(data, ['sourceID', 'workspaceID']), source_id: data.sourceID });
  }

  public async updateName(creatorID: number, workspaceID: string, name: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.updateName(workspaceID, name);
  }

  public async updateImage(creatorID: number, workspaceID: string, image: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.updateImage(workspaceID, image);
  }

  public async delete(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.delete(workspaceID);
  }

  public async isFeatureEnabled(creatorID: number, workspaceID: string | undefined, feature: Realtime.FeatureFlag): Promise<boolean> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const organization = workspaceID ? await client.workspace.getOrganization(workspaceID) : undefined;

    return client.feature.isEnabled(feature, workspaceID, organization?.id);
  }
}

export default WorkspaceService;
