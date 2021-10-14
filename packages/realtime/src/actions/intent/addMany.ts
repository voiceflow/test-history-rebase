import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddManyIntentsPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Intent>;

class AddManyIntents extends AbstractVersionResourceControl<AddManyIntentsPayload> {
  protected actionCreator = Realtime.intent.crud.addMany;

  protected process = async (ctx: Context, { payload }: Action<AddManyIntentsPayload>) => {
    const platform = await this.services.project.getPlatform(Number(ctx.userId), payload.projectID);

    await this.services.intent.createMany(
      Number(ctx.userId),
      payload.projectID,
      Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapToDB(payload.values)
    );
  };
}

export default AddManyIntents;
