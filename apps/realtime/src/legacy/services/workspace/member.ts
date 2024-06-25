import type { UserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../../control';

class WorkspaceMemberService extends AbstractControl {
  public async getAll(workspaceID: string): Promise<Realtime.AnyWorkspaceMember[]> {
    const [members, invites] = await Promise.all([
      this.services.identity.private.findAllMembersByWorkspaceID(workspaceID),
      this.services.identity.private.findAllInvitesByWorkspaceID(workspaceID),
    ]);

    return [
      ...Realtime.Adapters.Identity.workspaceMember.mapFromDB(
        members as unknown as Realtime.Identity.WorkspaceMember[]
      ),
      ...Realtime.Adapters.Identity.workspaceInvite.mapFromDB(
        invites as unknown as Realtime.Identity.WorkspaceInvite[]
      ),
    ];
  }

  public async patch(
    creatorID: number,
    workspaceID: string,
    memberID: number,
    { role }: Pick<Realtime.WorkspaceMember, 'role'>
  ): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.workspaceMember.update(workspaceID, memberID, { role });
  }

  public async remove(creatorID: number, workspaceID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.workspaceMember.remove(workspaceID, memberID);
  }

  public async removeSelf(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);
    return client.identity.workspaceMember.removeSelf(workspaceID);
  }

  public async sendInvite(
    creatorID: number,
    workspaceID: string,
    email: string,
    role: UserRole
  ): Promise<Realtime.PendingWorkspaceMember | null> {
    const [client] = await Promise.all([this.services.voiceflow.client.getByUserID(creatorID)]);

    const invite = await client.identity.workspaceInvitation.sendInvitation(workspaceID, email, role);

    if (!invite) return null;

    return {
      name: null,
      role: invite.role,
      email: invite.email,
      image: null,
      expiry: invite.expiry,
      created: null,
      creator_id: null,
    };
  }

  public async acceptInvite(creatorID: number, invite: string): Promise<string> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    const { workspaceID } = await client.identity.workspaceInvitation.acceptInvite(invite);

    return workspaceID;
  }

  public async updateInvite(creatorID: number, workspaceID: string, email: string, role?: UserRole): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.workspaceInvitation.updateInvitation(workspaceID, email, role);
  }

  public async cancelInvite(creatorID: number, workspaceID: string, email: string): Promise<void> {
    const client = await this.services.voiceflow.client.getByUserID(creatorID);

    return client.identity.workspaceInvitation.cancelInvite(workspaceID, email);
  }
}

export default WorkspaceMemberService;
