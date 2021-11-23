import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, unrestrictedAccess } from '@voiceflow/socket-utils';

import { AbstractActionControl } from '@/actions/utils';

class RefreshWorkspaces extends AbstractActionControl<Realtime.BaseCreatorPayload> {
  protected actionCreator = Realtime.workspace.crud.refresh;

  protected access = unrestrictedAccess(this);

  protected process = async (ctx: Context) => {
    const workspaces = await this.services.workspace.getAll(ctx.data.creatorID).then(Realtime.Adapters.workspaceAdapter.mapFromDB);

    await ctx.sendBack(Realtime.workspace.crud.replace({ values: workspaces }));
  };
}

export default RefreshWorkspaces;
