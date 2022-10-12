import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractControl, ControlOptions } from '../../control';
import logger from '../../logger';
import AccessCache from '../utils/accessCache';
import WorkspaceMemberService from './member';

class WorkspaceService extends AbstractControl {
  public access = new AccessCache('workspace', this.clients, this.services);

  public member: WorkspaceMemberService;

  constructor(options: ControlOptions) {
    super(options);

    this.member = new WorkspaceMemberService(options);
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

    const isIdentityWorkspaceEnabled = this.services.feature.isEnabled(Realtime.FeatureFlag.IDENTITY_WORKSPACE);

    if (isIdentityWorkspaceEnabled) {
      await client.identity.workspace.update(workspaceID, { name });
    } else {
      await client.workspace.updateName(workspaceID, name);
    }
  }

  public async updateImage(creatorID: number, workspaceID: string, image: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.updateImage(workspaceID, image);
  }

  public async delete(creatorID: number, workspaceID: string): Promise<void> {
    const [client, identityWorkspaceEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE),
    ]);

    if (identityWorkspaceEnabled) {
      const projectIDs = await this.models.project.getIDsByWorkspaceID(workspaceID);

      if (projectIDs.length) {
        await client.project.deleteMany(projectIDs);
      }

      await client.identity.workspace.remove(workspaceID);
      await client.workspace.deleteStripeSubscription(workspaceID).catch((error) => logger.warn(error));
    } else {
      await client.workspace.delete(workspaceID);
    }
  }

  public async isFeatureEnabled(creatorID: number, workspaceID: string | undefined, feature: Realtime.FeatureFlag): Promise<boolean> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const organization = workspaceID ? await client.workspace.getOrganization(workspaceID) : undefined;

    return this.services.feature.isEnabled(feature, { workspaceID, organizationID: organization?.id });
  }
}

export default WorkspaceService;
