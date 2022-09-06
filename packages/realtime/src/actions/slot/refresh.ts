import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class RefreshSlots extends AbstractVersionResourceControl<Realtime.BaseVersionPayload> {
  protected actionCreator = Realtime.slot.crud.refresh;

  protected process = async (ctx: Context, { payload }: Action<Realtime.BaseVersionPayload>) => {
    const slots = await this.services.slot.getAll(payload.versionID).then(Realtime.Adapters.slotAdapter.mapFromDB);

    await ctx.sendBack(
      Realtime.slot.crud.replace({ values: slots, workspaceID: payload.workspaceID, projectID: payload.projectID, versionID: payload.versionID })
    );
  };
}

export default RefreshSlots;
