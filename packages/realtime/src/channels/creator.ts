import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractChannelControl, ChannelContext } from './utils';

class CreatorChannel extends AbstractChannelControl<Realtime.Channels.CreatorChannelParams> {
  protected channel = Realtime.Channels.creator;

  protected access = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<SendBackActions> => {
    const creatorID = Number(ctx.userId);
    const workspaces = await this.services.workspace.getAll(creatorID).then(Realtime.Adapters.workspaceAdapter.mapFromDB);

    const workspacesWithMembers = await Promise.all(
      workspaces.map(async (workspace) => {
        const members = await this.services.workspace.member.getAll(creatorID, workspace.id).then(Realtime.Adapters.memberAdapter.mapFromDB);

        return { ...workspace, members };
      })
    );

    return Realtime.workspace.crud.replace({ values: workspacesWithMembers });
  };
}

export default CreatorChannel;
