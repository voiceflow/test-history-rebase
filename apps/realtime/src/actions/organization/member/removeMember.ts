import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractOrganizationChannelControl } from '../utils';

class RemoveWorkspaceMember extends AbstractOrganizationChannelControl<Realtime.organization.member.BaseMemberPayload> {
  protected actionCreator = Realtime.organization.member.remove;

  protected process = async (ctx: Context, { payload }: Action<Realtime.organization.member.BaseMemberPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.organization.member.remove(creatorID, payload.organizationID, payload.creatorID);
  };
}

export default RemoveWorkspaceMember;
