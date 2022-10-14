import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

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

      return [
        ...members.map(({ user, membership }) => ({
          name: user.name,
          role: membership.role,
          email: user.email,
          image: user.image,
          created: user.createdAt,
          creator_id: user.id,
        })),
        ...invites.map((invite) => ({
          name: null,
          role: invite.role,
          email: invite.email,
          image: null,
          created: '',
          creator_id: null,
        })),
      ];
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
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.sendInvite(workspaceID, email, role);
  }

  public async acceptInvite(creatorID: number, invite: string): Promise<string> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.workspace.acceptInvite(invite);
  }

  public async updateInvite(creatorID: number, workspaceID: string, email: string, role?: UserRole): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.updateInvite(workspaceID, email, role);
  }

  public async cancelInvite(creatorID: number, workspaceID: string, email: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.workspace.cancelInvite(workspaceID, email);
  }
}

export default WorkspaceMemberService;
