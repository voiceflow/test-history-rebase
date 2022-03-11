import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from './utils';

class CheckoutWorkspace extends AbstractWorkspaceChannelControl<Realtime.workspace.CheckoutWorkspacePayload> {
  protected actionCreator = Realtime.workspace.checkout;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.CheckoutWorkspacePayload>) => {
    await this.services.workspace.checkout(ctx.data.creatorID, payload);

    const workspace = await this.services.workspace.get(ctx.data.creatorID, payload.workspaceID).then(Realtime.Adapters.workspaceAdapter.fromDB);

    await ctx.sendBack(Realtime.workspace.crud.update({ key: payload.workspaceID, value: workspace }));
  };
}

export default CheckoutWorkspace;
