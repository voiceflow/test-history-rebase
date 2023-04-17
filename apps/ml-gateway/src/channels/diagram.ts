import { SendBackActions } from '@logux/server';
import * as ML from '@voiceflow/ml-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class DiagramChannel extends AbstractChannelControl<ML.Channels.DiagramChannelParams> {
  protected channel = ML.Channels.diagram;

  protected access = async (_ctx: ChannelContext<ML.Channels.DiagramChannelParams>): Promise<boolean> => {
    // TODO: implement
    return false;
  };

  protected load = async (_ctx: ChannelContext<ML.Channels.DiagramChannelParams>): Promise<SendBackActions> => {
    // TODO: implement
  };
}

export default DiagramChannel;
