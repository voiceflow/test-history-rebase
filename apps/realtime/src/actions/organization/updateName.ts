import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractOrganizationChannelControl } from './utils';

class UpdateOrganizationName extends AbstractOrganizationChannelControl<Realtime.organization.UpdateOrganizationNamePayload> {
  protected actionCreator = Realtime.organization.updateName;

  protected process = async (ctx: Context, { payload }: Action<Realtime.organization.UpdateOrganizationNamePayload>) => {
    await this.services.organization.updateName(ctx.data.creatorID, payload.organizationID, payload.name);
  };
}

export default UpdateOrganizationName;
