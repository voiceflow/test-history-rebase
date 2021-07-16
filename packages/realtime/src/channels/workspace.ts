import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class WorkspaceChannel extends AbstractChannelControl<Realtime.Channels.WorkspaceChannelParams> {
  channel = Realtime.Channels.workspace({ workspaceID: ':workspaceID' });

  protected access = async (ctx: ChannelContext<Realtime.Channels.WorkspaceChannelParams>): Promise<boolean> => {
    return this.services.workspace.canRead(ctx.params.workspaceID, Number(ctx.userId));
  };
}

export default WorkspaceChannel;
