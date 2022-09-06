import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddManyIntentsPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDValuesPayload<Realtime.Intent> {}

class AddManyIntents extends AbstractVersionResourceControl<AddManyIntentsPayload> {
  protected actionCreator = Realtime.intent.crud.addMany;

  protected process = async (_ctx: Context, { payload }: Action<AddManyIntentsPayload>) => {
    const { versionID, values, projectMeta } = payload;

    await this.services.intent.createMany(versionID, Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectMeta.type).mapToDB(values));
  };
}

export default AddManyIntents;
