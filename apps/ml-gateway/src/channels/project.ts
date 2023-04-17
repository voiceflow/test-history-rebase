import { SendBackActions } from '@logux/server';
import * as ML from '@voiceflow/ml-sdk';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class ProjectChannel extends AbstractChannelControl<ML.Channels.ProjectChannelParams> {
  protected channel = ML.Channels.project;

  protected access = async (_ctx: ChannelContext<ML.Channels.ProjectChannelParams>): Promise<boolean> => {
    // TODO: implement
    return false;
  };

  protected load = async (_ctx: ChannelContext<ML.Channels.ProjectChannelParams>): Promise<SendBackActions> => {
    // TODO: implement
  };
}

export default ProjectChannel;
