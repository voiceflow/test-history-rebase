/* eslint-disable no-return-await */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { HEARTBEAT_EXPIRE_TIMEOUT } from '../../constants';
import { AbstractControl, ControlOptions } from '../../control';
import logger from '../../logger';
import AccessCache from '../utils/accessCache';
import WorkspaceMemberService from './member';

class WorkspaceService extends AbstractControl {
  public access = new AccessCache('workspace', this.clients, this.services);

  public member: WorkspaceMemberService;

  private static getConnectedProjectsKey({ workspaceID }: { workspaceID: string }): string {
    return `workspaces:${workspaceID}:projects`;
  }

  private connectedProjectsCache = this.clients.cache.createSet({
    expire: HEARTBEAT_EXPIRE_TIMEOUT,
    keyCreator: WorkspaceService.getConnectedProjectsKey,
  });

  constructor(options: ControlOptions) {
    super(options);

    this.member = new WorkspaceMemberService(options);
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

  public async getConnectedViewersPerProject(workspaceID: string): Promise<Record<string, Record<string, Realtime.Viewer[]>>> {
    const projectIDs = await this.getConnectedProjects(workspaceID);
    const projectsViewers = await Promise.all(projectIDs.map((projectID) => this.services.project.getConnectedViewersPerDiagram(projectID)));

    return Object.fromEntries(projectIDs.map((projectID, index) => [projectID, projectsViewers[index]]));
  }

  public async get(creatorID: number, workspaceID: string): Promise<Realtime.DBWorkspace> {
    const [client, identityWorkspaceEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.feature.isEnabled(Realtime.FeatureFlag.IDENTITY_WORKSPACE, { userID: creatorID }),
    ]);

    if (identityWorkspaceEnabled) {
      const [workspace, identityWorkspace, identityWorkspaceMembers] = await Promise.all([
        client.workspace.get(workspaceID),
        client.identity.workspace.findOne(workspaceID),
        this.member.getAll(creatorID, workspaceID),
      ]);

      return {
        ...workspace,
        name: identityWorkspace.name,
        image: identityWorkspace.image,
        members: identityWorkspaceMembers,
        created: identityWorkspace.createdAt,
        team_id: identityWorkspace.id,
        organization_id: identityWorkspace.organizationID,
      };
    }

    return client.workspace.get(workspaceID);
  }

  public async getAll(creatorID: number): Promise<Realtime.DBWorkspace[]> {
    const [client, identityWorkspaceEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.feature.isEnabled(Realtime.FeatureFlag.IDENTITY_WORKSPACE, { userID: creatorID }),
    ]);

    if (identityWorkspaceEnabled) {
      const [workspaces, identityWorkspaces] = await Promise.all([client.workspace.list(), client.identity.workspace.list()]);

      // this maps data from the new identity workspace to the old interface
      // we decided to do this just to communicate the intention of fully migrating in the future.
      // ideally all the extra data we have in the workspace interface should be fetched separately
      const legacyWorkspaceMap = Utils.array.createMap(workspaces, (workspace) => workspace.team_id);

      return identityWorkspaces.map((identityWorkspace) => {
        const workspace = legacyWorkspaceMap[identityWorkspace.id];

        return {
          ...workspace,
          name: identityWorkspace.name,
          image: identityWorkspace.image,
          created: identityWorkspace.createdAt,
          team_id: identityWorkspace.id,
          organization_id: identityWorkspace.organizationID,
          // resetting members since identity workspace list doesn't have members array in it
          members: [],
        };
      });
    }

    return client.workspace.list();
  }

  public async create(creatorID: number, { name, image }: { name: string; image?: string; organizationID?: string }): Promise<Realtime.DBWorkspace> {
    const [client] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID)]);

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

  private async getOrganization(creatorID: number, workspaceID: string): Promise<Realtime.Organization | undefined> {
    const isIdentityWorkspaceEnabled = this.services.feature.isEnabled(Realtime.FeatureFlag.IDENTITY_WORKSPACE, { userID: creatorID });
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return isIdentityWorkspaceEnabled
      ? await client.identity.workspace.getOrganization(workspaceID)
      : await client.workspace.getOrganization(workspaceID);
  }

  public async isFeatureEnabled(creatorID: number, workspaceID: string | undefined, feature: Realtime.FeatureFlag): Promise<boolean> {
    const organization = await (workspaceID ? this.getOrganization(creatorID, workspaceID) : undefined);

    return this.services.feature.isEnabled(feature, { userID: creatorID, workspaceID, organizationID: organization?.id });
  }
}

export default WorkspaceService;
