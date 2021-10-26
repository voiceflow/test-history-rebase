import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type AddManyIntentsPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Intent>;

class AddManyIntents extends AbstractVersionResourceControl<AddManyIntentsPayload> {
  protected actionCreator = Realtime.intent.crud.addMany;

  protected process = async (ctx: Context, { payload }: Action<AddManyIntentsPayload>) => {
    const { creatorID } = ctx.data;
    const platform = await this.services.project.getPlatform(creatorID, payload.projectID);

    await this.services.intent.createMany(
      creatorID,
      payload.versionID,
      Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapToDB(payload.values)
    );
  };
}

export default AddManyIntents;
