import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class ProjectChannel extends AbstractChannelControl<Realtime.Channels.ProjectChannelParams> {
  protected channel = Realtime.Channels.project;

  protected access = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<boolean> => {
    return this.services.project.access.canRead(Number(ctx.userId), ctx.params.projectID);
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.ProjectChannelParams>): Promise<SendBackActions> => {
    const { workspaceID, projectID } = ctx.params;

    const viewers = await this.services.project.getConnectedViewersPerDiagram(projectID);

    return Realtime.project.awareness.updateViewers({ viewers, projectID, workspaceID });
  };
}

export default ProjectChannel;
