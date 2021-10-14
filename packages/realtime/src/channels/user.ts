import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class UserChannel extends AbstractChannelControl<Realtime.Channels.UserChannelParams> {
  protected channel = Realtime.Channels.user;

  protected access = async (ctx: ChannelContext<Realtime.Channels.UserChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.UserChannelParams>): Promise<SendBackActions> => {
    const workspaces = await this.services.workspace.getAll(Number(ctx.userId)).then(Realtime.Adapters.workspaceAdapter.mapFromDB);

    return Realtime.workspace.crud.replace({ values: workspaces });
  };
}

export default UserChannel;
