import { SendBackActions } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ChannelContext } from '@voiceflow/socket-utils';

import { AbstractChannelControl } from './utils';

class CreatorChannel extends AbstractChannelControl<Realtime.Channels.CreatorChannelParams> {
  protected channel = Realtime.Channels.creator;

  protected access = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<boolean> => {
    return ctx.params.creatorID === ctx.userId;
  };

  protected load = async (ctx: ChannelContext<Realtime.Channels.CreatorChannelParams>): Promise<SendBackActions> => {
    const [workspaces, organizations] = await Promise.all([
      this.services.workspace.getAll(Number(ctx.userId)).then(Realtime.Adapters.workspaceAdapter.mapFromDB),
      this.services.organization.getAll(Number(ctx.userId)).then(Realtime.Adapters.organizationAdapter.mapFromDB),
    ]);

    return [
      Realtime.workspace.crud.replace({
        // TODO: replace with `values: workspaces` when clients are migrated to v1.1.0
        values: this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_1_0)
          ? workspaces
          : workspaces.map((workspace) => ({ ...workspace, members: [] as any })),
      }),
      Realtime.organization.crud.replace({ values: organizations }),
    ];
  };
}

export default CreatorChannel;
