import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddIntentPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.Intent> {}

class AddIntent extends AbstractVersionResourceControl<AddIntentPayload> {
  protected actionCreator = Realtime.intent.crud.add;

  protected process = async (_ctx: Context, { payload }: Action<AddIntentPayload>) => {
    const { versionID, key, value, projectMeta } = payload;

    await this.services.intent.create(versionID, {
      ...Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectMeta.type).toDB(value),
      key,
    });
  };
}

export default AddIntent;
