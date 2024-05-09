import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectResourceControl } from '../utils';

class AddProjectMember extends AbstractProjectResourceControl<Realtime.project.member.AddMemberPayload> {
  protected actionCreator = Realtime.project.member.add;

  protected process = async (ctx: Context, { payload }: Action<Realtime.project.member.AddMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.project.member.add(creatorID, payload.projectID, payload.member);
  };
}

export default AddProjectMember;
