import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectResourceControl } from '../utils';

class PatchWorkspaceMember extends AbstractProjectResourceControl<Realtime.project.member.PatchMemberPayload> {
  protected actionCreator = Realtime.project.member.patch;

  protected process = async (ctx: Context, { payload }: Action<Realtime.project.member.PatchMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.project.member.patch(creatorID, payload.projectID, payload.creatorID, Utils.object.pick(payload.member, ['role']));
  };
}

export default PatchWorkspaceMember;
