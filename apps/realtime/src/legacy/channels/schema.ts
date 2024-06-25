import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class SchemaChannel extends AbstractChannelControl<Realtime.Channels.SchemaChannelParams> {
  protected channel = Realtime.Channels.schema;

  protected access = async (ctx: ChannelContext<Realtime.Channels.SchemaChannelParams>): Promise<boolean> => {
    return this.services.version.access.canRead(Number(ctx.userId), ctx.params.versionID);
  };
}

export default SchemaChannel;
