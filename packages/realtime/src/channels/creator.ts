import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class CreatorChannel extends AbstractChannelControl<Realtime.Channels.CreatorChannelParams> {
  protected channel = Realtime.Channels.creator;

  protected access = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const workspaces = await this.services.workspace.getAllWithMembers(creatorID);

    return Realtime.workspace.crud.replace({ values: workspaces });
  };
}

export default CreatorChannel;
