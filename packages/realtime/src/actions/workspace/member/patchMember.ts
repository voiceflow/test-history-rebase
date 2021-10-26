import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractWorkspaceChannelControl } from '../utils';

class PatchWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.PatchMemberPayload> {
  protected actionCreator = Realtime.workspace.member.patch;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.member.PatchMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.workspace.member.patch(creatorID, payload.workspaceID, payload.creatorID, _.pick(payload.member, 'role'));
  };
}

export default PatchWorkspaceMember;
