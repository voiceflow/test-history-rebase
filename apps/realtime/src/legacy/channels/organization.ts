import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class OrganizationChannel extends AbstractChannelControl<Realtime.Channels.OrganizationChannelParams> {
  protected channel = Realtime.Channels.organization;

  protected access = async (ctx: ChannelContext<Realtime.Channels.OrganizationChannelParams>): Promise<boolean> => {
    return this.services.organization.access.canWrite(Number(ctx.userId), ctx.params.organizationID);
  };
}

export default OrganizationChannel;
