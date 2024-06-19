import { Controller, Inject, Logger } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, Context, LoguxService, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Actions, Channels } from '@voiceflow/sdk-logux-designer';
import { AxiosError } from 'axios';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';
import { OrganizationIdentityService } from '@/organization/identity/identity.service';
import { AsyncActionError } from '@/utils/logux.util';

import { WorkspaceService } from '../workspace.service';
import { WorkspaceInvitationService } from './invitation.service';

@Controller()
@InjectRequestContext()
export class WorkspaceInvitationLoguxController {
  private readonly logger = new Logger(WorkspaceInvitationLoguxController.name);

  constructor(
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(WorkspaceInvitationService)
    private readonly workspacMemberService: WorkspaceInvitationService,
    @Inject(OrganizationIdentityService)
    private readonly organizationIdentityService: OrganizationIdentityService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  @Action.Async(Realtime.workspace.member.acceptInvite)
  @UseRequestContext()
  async acceptInvite(
    @Payload() { invite }: Realtime.workspace.member.AcceptInvitePayload,
    @Context() ctx: Context.Channel<Channels.WorkspaceParams>,
    @AuthMeta() authMeta: AuthMetaPayload
  ): Promise<string> {
    try {
      const { userID: creatorID } = authMeta;
      const workspaceID = await this.workspacMemberService.acceptInvite(creatorID, invite);

      const [dbWorkspace, organizations] = await Promise.all([
        this.workspaceService.findOne(creatorID, workspaceID),
        this.organizationIdentityService.getAll(creatorID),
      ]);

      const workspace = Realtime.Adapters.workspaceAdapter.fromDB(dbWorkspace);

      // broadcast new workspace and updated member list
      await Promise.all([
        this.logux.process(Realtime.workspace.crud.add({ key: workspaceID, value: workspace }), {
          channel: Realtime.Channels.creator.build({ creatorID: ctx.userId }),
        }),
        this.logux.process(Actions.Organization.Replace({ data: organizations }), {
          channel: Realtime.Channels.creator.build({ creatorID: ctx.userId }),
        }),
        this.logux.processAs(
          Realtime.workspace.member.replace({ members: dbWorkspace.members, workspaceID }),
          authMeta
        ),
      ]);

      return workspaceID;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        throw new AsyncActionError({
          message: 'You are already a member of this workspace.',
          code: Realtime.ErrorCode.ALREADY_MEMBER_OF_WORKSPACE,
        });
      }

      this.logger.error(error);
      throw error;
    }
  }

  @Action(Realtime.workspace.member.cancelInvite)
  @Authorize.Permissions<Realtime.workspace.member.BaseInvitePayload>(
    [Permission.WORKSPACE_READ],
    ({ workspaceID }) => ({
      id: workspaceID,
      kind: 'workspace',
    })
  )
  @UseRequestContext()
  async cancelInvite(
    @Payload() payload: Realtime.workspace.member.BaseInvitePayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.workspacMemberService.cancelInvite(authMeta.userID, payload.workspaceID, payload.email);
  }

  @Action.Async(Realtime.workspace.member.sendInvite)
  @Authorize.Permissions<Realtime.workspace.member.SendInvitePayload>(
    [Permission.WORKSPACE_MEMBER_CREATE],
    ({ workspaceID }) => ({
      id: workspaceID,
      kind: 'workspace',
    })
  )
  @Broadcast<Realtime.workspace.member.SendInvitePayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @UseRequestContext()
  async sendInvite(
    @Payload() payload: Realtime.workspace.member.SendInvitePayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    const newMember = await this.workspacMemberService.sendInvite(
      authMeta.userID,
      payload.workspaceID,
      payload.email,
      payload.role
    );

    if (newMember) {
      await this.logux.processAs(
        Realtime.workspace.member.add({ member: newMember, workspaceID: payload.workspaceID }),
        authMeta
      );
    } else {
      await this.logux.processAs(
        Realtime.workspace.member.renewInvite({
          workspaceID: payload.workspaceID,
          email: payload.email,
          role: payload.role,
        }),
        authMeta
      );
    }

    // Realtime.workspace.member.updateInvite
    return newMember;
  }

  @Action(Realtime.workspace.member.updateInvite)
  @Broadcast<Realtime.workspace.member.UpdateInvitePayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async updateInvite(
    @Payload() payload: Realtime.workspace.member.UpdateInvitePayload,
    @AuthMeta() authMeta: AuthMetaPayload
  ) {
    await this.workspacMemberService.updateInvite(authMeta.userID, payload.workspaceID, payload.email, payload.role);
  }

  @Action(Realtime.workspace.member.renewInvite)
  @Broadcast<Realtime.workspace.member.RenewInvitePayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async renewInvite(@Payload() _: Realtime.workspace.member.RenewInvitePayload) {
    // for broadcast only
  }
}
