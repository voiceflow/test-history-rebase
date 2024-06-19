import { Controller, Inject } from '@nestjs/common';
import { Action, AuthMeta, AuthMetaPayload, Broadcast, LoguxService, Payload } from '@voiceflow/nestjs-logux';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Permission } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Channels } from '@voiceflow/sdk-logux-designer';

import { BroadcastOnly, InjectRequestContext, UseRequestContext } from '@/common';

import { WorkspaceService } from '../workspace.service';
import { WorkspaceMemberService } from './member.service';

@Controller()
@InjectRequestContext()
export class WorkspaceMemberLoguxController {
  constructor(
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(WorkspaceMemberService)
    private readonly workspacMemberService: WorkspaceMemberService,
    @Inject(LoguxService)
    private readonly logux: LoguxService
  ) {}

  @Action(Realtime.workspace.member.eject)
  @Authorize.Permissions<Realtime.workspace.member.EjectPayload>([Permission.WORKSPACE_READ], ({ workspaceID }) => ({
    id: workspaceID,
    kind: 'workspace',
  }))
  @Broadcast<Realtime.workspace.member.EjectPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async ejectMember(@Payload() _: Realtime.workspace.member.EjectPayload) {
    // for broadcast only
  }

  @Action(Realtime.workspace.member.add)
  @Broadcast<Realtime.workspace.member.AddMemberPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async add(@Payload() _: Realtime.workspace.member.AddMemberPayload) {
    // for broadcast only
  }

  @Action(Realtime.workspace.member.replace)
  @Broadcast<Realtime.workspace.member.ReplaceMembersPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  async replace(@Payload() _: Realtime.workspace.member.ReplaceMembersPayload) {
    // for broadcast only
  }

  @Action(Realtime.workspace.member.patch)
  @Authorize.Permissions<Realtime.workspace.member.PatchMemberPayload>(
    [Permission.WORKSPACE_MEMBER_UPDATE],
    ({ workspaceID }) => ({
      id: workspaceID,
      kind: 'workspace',
    })
  )
  @Broadcast<Realtime.workspace.member.PatchMemberPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  @UseRequestContext()
  async patch(@Payload() payload: Realtime.workspace.member.PatchMemberPayload, @AuthMeta() authMeta: AuthMetaPayload) {
    await this.workspacMemberService.patch(authMeta.userID, payload.workspaceID, payload.creatorID, {
      role: payload.member.role,
    });
  }

  @Action(Realtime.workspace.member.remove)
  @Authorize.Permissions<Realtime.workspace.member.BaseMemberPayload>(
    [Permission.WORKSPACE_MEMBER_UPDATE],
    ({ workspaceID }) => ({
      id: workspaceID,
      kind: 'workspace',
    })
  )
  @Broadcast<Realtime.workspace.member.BaseMemberPayload>(({ workspaceID }) => ({
    channel: Channels.workspace.build({ workspaceID }),
  }))
  @BroadcastOnly()
  @UseRequestContext()
  async remove(@Payload() payload: Realtime.workspace.member.BaseMemberPayload, @AuthMeta() authMeta: AuthMetaPayload) {
    const workspace = await this.workspaceService.findOne(authMeta.userID, payload.workspaceID);

    await this.workspacMemberService.remove(authMeta.userID, payload.workspaceID, payload.creatorID);

    await this.logux.process(
      Realtime.workspace.member.eject({
        workspaceID: payload.workspaceID,
        workspaceName: workspace.name,
        creatorID: payload.creatorID,
      })
    );
  }
}
