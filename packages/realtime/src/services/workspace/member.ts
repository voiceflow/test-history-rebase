import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractControl } from '../../control';

class WorkspaceMemberService extends AbstractControl {
  public async getAll(creatorID: number, workspaceID: string): Promise<Realtime.AnyWorkspaceMember[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const [members, invites] = await Promise.all([
      client.identity.workspaceMember.list(workspaceID),
      client.identity.workspaceInvitation.list(workspaceID),
    ]);

    return [...Realtime.Adapters.Identity.workspaceMember.mapFromDB(members), ...Realtime.Adapters.Identity.workspaceInvite.mapFromDB(invites)];
  }

  public async patch(creatorID: number, workspaceID: string, memberID: number, { role }: Pick<Realtime.WorkspaceMember, 'role'>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.workspaceMember.update(workspaceID, memberID, { role });
  }

  public async remove(creatorID: number, workspaceID: string, memberID: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.workspaceMember.remove(workspaceID, memberID);
  }

  public async removeSelf(creatorID: number, workspaceID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    return client.identity.workspaceMember.removeSelf(workspaceID);
  }

  public async sendInvite(creatorID: number, workspaceID: string, email: string, role: UserRole): Promise<Realtime.PendingWorkspaceMember | null> {
    const [client] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID)]);

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
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const { workspaceID } = await client.identity.workspaceInvitation.acceptInvite(invite);

    return workspaceID;
  }

  public async updateInvite(creatorID: number, workspaceID: string, email: string, role?: UserRole): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.workspaceInvitation.updateInvitation(workspaceID, email, role);
  }

  public async cancelInvite(creatorID: number, workspaceID: string, email: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.identity.workspaceInvitation.cancelInvite(workspaceID, email);
  }
}

export default WorkspaceMemberService;
