import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class VersionChannel extends AbstractChannelControl<Realtime.Channels.VersionChannelParams> {
  channel = Realtime.Channels.version({ versionID: ':versionID', projectID: ':projectID' });

  protected access = async (ctx: ChannelContext<Realtime.Channels.VersionChannelParams>): Promise<boolean> => {
    return this.services.version.canRead(ctx.params.versionID, Number(ctx.userId));
  };
}

export default VersionChannel;
