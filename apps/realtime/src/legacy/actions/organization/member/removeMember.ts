import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractOrganizationChannelControl } from '../utils';

class RemoveWorkspaceMember extends AbstractOrganizationChannelControl<Realtime.organization.member.BaseMemberPayload> {
  protected actionCreator = Realtime.organization.member.remove;

  protected process = async (_: Context, { payload }: Action<Realtime.organization.member.BaseMemberPayload>) => {
    await this.services.organizationMember.remove(payload.organizationID, payload.creatorID);
  };
}

export default RemoveWorkspaceMember;
