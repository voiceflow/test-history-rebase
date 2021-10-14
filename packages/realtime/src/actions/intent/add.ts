import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddIntentPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Intent>;

class AddIntent extends AbstractVersionResourceControl<AddIntentPayload> {
  protected actionCreator = Realtime.intent.crud.add;

  protected process = async (ctx: Context, { payload }: Action<AddIntentPayload>) => {
    const creatorID = Number(ctx.userId);
    const platform = await this.services.project.getPlatform(creatorID, payload.projectID);

    await this.services.intent.create(creatorID, payload.versionID, {
      ...Realtime.Adapters.getPlatformIntentAdapter<any>(platform).toDB(payload.value),
      key: payload.key,
    });
  };
}

export default AddIntent;
