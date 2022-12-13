import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddManySlotsPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuesPayload<Realtime.Slot> {}

class AddManySlots extends AbstractVersionResourceControl<AddManySlotsPayload> {
  protected actionCreator = Realtime.slot.crud.addMany;

  protected process = async (_ctx: Context, { payload }: Action<AddManySlotsPayload>) => {
    await this.services.slot.createMany(payload.versionID, Realtime.Adapters.slotAdapter.mapToDB(payload.values));
  };

  protected finally = async (ctx: Context, { payload }: Action<AddManySlotsPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddManySlots;
