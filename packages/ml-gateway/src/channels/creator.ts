import { SendBackActions } from '@logux/server';
import * as ML from '@voiceflow/ml-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class CreatorChannel extends AbstractChannelControl<ML.Channels.CreatorChannelParams> {
  protected channel = ML.Channels.creator;

  protected access = async (ctx: ChannelContext<ML.Channels.CreatorChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (_ctx: ChannelContext<ML.Channels.CreatorChannelParams>): Promise<SendBackActions> => {
    // TODO: implement
  };
}

export default CreatorChannel;
