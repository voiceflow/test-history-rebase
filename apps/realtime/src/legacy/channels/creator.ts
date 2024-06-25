import type { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import type { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class CreatorChannel extends AbstractChannelControl<Realtime.Channels.CreatorChannelParams> {
  protected channel = Realtime.Channels.creator;

  protected access = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<SendBackActions> => {
    // the timestamp of Realtime.Channels.creator it is called, not when it is resolved
    const [workspacesMeta, organizationsMeta] = [
      { id: this.server.log.generateId() },
      { id: this.server.log.generateId() },
    ];

    const [workspaces, organizations] = await Promise.all([
      this.services.workspace.getAll(Number(ctx.userId)).then(Realtime.Adapters.workspaceAdapter.mapFromDB),
      this.services.organization.getAll(Number(ctx.userId)),
    ]);

    return [
      [Realtime.workspace.crud.replace({ values: workspaces }), workspacesMeta],
      [Actions.Organization.Replace({ data: organizations }), organizationsMeta],
    ];
  };
}

export default CreatorChannel;
