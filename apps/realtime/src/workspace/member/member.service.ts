import { Inject, Injectable } from '@nestjs/common';
import { UserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { WorkspaceInvite } from '@voiceflow/sdk-identity';
import { IdentityClient } from '@voiceflow/sdk-identity';

import { UserService } from '@/user/user.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(IdentityClient) private readonly identity: IdentityClient
  ) {}

  public async getAll(workspaceID: string): Promise<Realtime.AnyWorkspaceMember[]> {
    const [members, invites] = await Promise.all([
      this.identity.private.findAllMembersByWorkspaceID(workspaceID),
      this.identity.private.findAllInvitesByWorkspaceID(workspaceID),
    ]);

    return [
      ...Realtime.Adapters.Identity.workspaceMember.mapFromDB(members),
      ...Realtime.Adapters.Identity.workspaceInvite.mapFromDB(invites),
    ];
  }

  public async patch(
    creatorID: number,
    workspaceID: string,
    memberID: number,
    { role }: Pick<Realtime.WorkspaceMember, 'role'>
  ): Promise<void> {
    return this.identity.workspaceMember.patchMember(
      workspaceID,
      memberID,
      { role },
      { headers: await this.userService.getAuthHeadersByID(creatorID) }
    );
  }

  public async remove(creatorID: number, workspaceID: string, memberID: number): Promise<void> {
    return this.identity.workspaceMember.deleteMember(workspaceID, memberID, {
      headers: await this.userService.getAuthHeadersByID(creatorID),
    });
  }

  public async removeSelf(creatorID: number, workspaceID: string): Promise<void> {
    return this.identity.workspaceMember.leaveWorkspace(workspaceID, {
      headers: await this.userService.getAuthHeadersByID(creatorID),
    });
  }

  public async sendInvite(
    creatorID: number,
    workspaceID: string,
    email: string,
    role: UserRole
  ): Promise<Realtime.PendingWorkspaceMember | null> {
    const result = await this.identity.workspaceInvitation.sendInvitation(
      workspaceID,
      { email, role },
      { headers: await this.userService.getAuthHeadersByID(creatorID) }
    );

    // sdk return unknown type, so we need to cast it to the correct type
    const invite = result as WorkspaceInvite | null;

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

  public async acceptInvite(creatorID: number, invitationToken: string): Promise<string> {
    const { workspaceID } = await this.identity.workspaceInvitation.acceptInvitation(invitationToken, {
      headers: await this.userService.getAuthHeadersByID(creatorID),
    });

    return workspaceID;
  }

  public async updateInvite(creatorID: number, workspaceID: string, email: string, role: UserRole): Promise<void> {
    return this.identity.workspaceInvitation.patchOne(
      workspaceID,
      { email, role },
      { headers: await this.userService.getAuthHeadersByID(creatorID) }
    );
  }

  public async cancelInvite(creatorID: number, workspaceID: string, email: string): Promise<void> {
    return this.identity.workspaceInvitation.deleteInvitation(
      workspaceID,
      { email },
      { headers: await this.userService.getAuthHeadersByID(creatorID) }
    );
  }
}
