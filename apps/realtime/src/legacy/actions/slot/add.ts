import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

interface AddSlotPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.Slot> {}

class AddSlot extends AbstractVersionResourceControl<AddSlotPayload> {
  protected actionCreator = Realtime.slot.crud.add;

  protected process = async (_ctx: Context, { payload }: Action<AddSlotPayload>) => {
    await this.services.slot.create(payload.versionID, {
      ...Realtime.Adapters.slotAdapter.toDB(payload.value),
      key: payload.key,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<AddSlotPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddSlot;
