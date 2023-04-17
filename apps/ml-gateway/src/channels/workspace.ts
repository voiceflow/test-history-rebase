import { SendBackActions } from '@logux/server';
import * as ML from '@voiceflow/ml-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class WorkspaceChannel extends AbstractChannelControl<ML.Channels.WorkspaceChannelParams> {
  protected channel = ML.Channels.workspace;

  protected access = async (_ctx: ChannelContext<ML.Channels.WorkspaceChannelParams>): Promise<boolean> => {
    // TODO: implement
    return false;
  };

  protected load = async (_ctx: ChannelContext<ML.Channels.WorkspaceChannelParams>): Promise<SendBackActions> => {
    // TODO: implement
  };
}

export default WorkspaceChannel;
