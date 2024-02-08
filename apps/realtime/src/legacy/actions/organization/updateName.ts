import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractOrganizationChannelControl } from './utils';

class UpdateOrganizationName extends AbstractOrganizationChannelControl<Realtime.organization.UpdateOrganizationNamePayload> {
  protected actionCreator = Realtime.organization.updateName;

  protected process = async (_: Context, { payload }: Action<Realtime.organization.UpdateOrganizationNamePayload>) => {
    await this.services.organization.updateName(payload.organizationID, payload.name);
  };
}

export default UpdateOrganizationName;
