import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';

import { AbstractControl } from '../../control';

class WorkspaceMemberService extends AbstractControl {
  public async getAll(creatorID: number, workspaceID: string): Promise<Array<Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember>> {
    const [client, identityWorkspaceMemberEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_MEMBER),
    ]);

    if (identityWorkspaceMemberEnabled) {
      const [members, invites] = await Promise.all([
        client.identity.workspaceMember.list(workspaceID),
        client.identity.workspaceInvitation.list(workspaceID),
      ]);

      // sorting members by role strength and removing duplicates
      const activeMembers = _.uniqBy(
        members.sort((a, b) => Realtime.USER_ROLE_STRENGTH[b.membership.role] - Realtime.USER_ROLE_STRENGTH[a.membership.role]),
        'user.id'
      ).map(({ user, membership }) => ({
        name: user.name,
        role: membership.role,
        email: user.email,
        image: user.image,
        created: user.createdAt,
        creator_id: user.id,
      }));

      const pendingMembers = invites.map((invite) => ({
        name: null,
        role: invite.role,
        email: invite.email,
        image: null,
        created: '',
        creator_id: null,
      }));

      return [...activeMembers, ...pendingMembers];
    }

    return client.workspace.listMembers(workspaceID);
  }

  public async patch(
    creatorID: number,
    workspaceID: string,
    memberCreatorID: number,
    { role }: Pick<Realtime.WorkspaceMember, 'role'>
  ): Promise<void> {
    const [client, identityWorkspaceMemberEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_MEMBER),
    ]);

    if (identityWorkspaceMemberEnabled) {
      await client.identity.workspaceMember.update(workspaceID, memberCreatorID, { role });
    } else {
      await client.workspace.patchMember(workspaceID, memberCreatorID, { role });
    }
  }

  public async remove(creatorID: number, workspaceID: string, memberCreatorID: number): Promise<void> {
    const [client, identityWorkspaceMemberEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_MEMBER),
    ]);

    if (identityWorkspaceMemberEnabled) {
      await client.identity.workspaceMember.remove(workspaceID, memberCreatorID);
    } else {
      await client.workspace.removeMember(workspaceID, memberCreatorID);
    }
  }

  public async removeSelf(creatorID: number, workspaceID: string): Promise<void> {
    const [client, identityWorkspaceMemberEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_MEMBER),
    ]);

    if (identityWorkspaceMemberEnabled) {
      await client.identity.workspaceMember.removeSelf(workspaceID);
    } else {
      await client.workspace.removeSelf(workspaceID);
    }
  }

  public async sendInvite(creatorID: number, workspaceID: string, email: string, role?: UserRole): Promise<Realtime.PendingWorkspaceMember | null> {
    const [client, identityWorkspaceInviteEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE),
    ]);

    if (identityWorkspaceInviteEnabled) {
      const invite = await client.identity.workspaceInvitation.sendInvitation(workspaceID, email, role);

      return {
        name: null,
        role: invite.role,
        email: invite.email,
        image: null,
        created: '',
        creator_id: null,
      };
    }
    return client.workspace.sendInvite(workspaceID, email, role);
  }

  public async acceptInvite(creatorID: number, invite: string): Promise<string> {
    const [client, identityWorkspaceInviteEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, '', Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE),
    ]);

    if (identityWorkspaceInviteEnabled) {
      const { workspaceID } = await client.identity.workspaceInvitation.acceptInvite(invite);

      return workspaceID;
    }

    return client.workspace.acceptInvite(invite);
  }

  public async updateInvite(creatorID: number, workspaceID: string, email: string, role?: UserRole): Promise<void> {
    const [client, identityWorkspaceInviteEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE),
    ]);

    if (identityWorkspaceInviteEnabled) {
      return client.identity.workspaceInvitation.updateInvitation(workspaceID, email, role);
    }

    return client.workspace.updateInvite(workspaceID, email, role);
  }

  public async cancelInvite(creatorID: number, workspaceID: string, email: string): Promise<void> {
    const [client, identityWorkspaceInviteEnabled] = await Promise.all([
      this.services.voiceflow.getClientByUserID(creatorID),
      this.services.workspace.isFeatureEnabled(creatorID, workspaceID, Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE),
    ]);

    if (identityWorkspaceInviteEnabled) {
      return client.identity.workspaceInvitation.cancelInvite(workspaceID, email);
    }

    return client.workspace.cancelInvite(workspaceID, email);
  }
}

export default WorkspaceMemberService;
