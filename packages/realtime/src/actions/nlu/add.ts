import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface AddUnclassifiedDataPayload
  extends Realtime.nlu.BaseNLUUnclassifiedDataPayload,
    Realtime.actionUtils.CRUDValuePayload<Realtime.NluUnclassifiedData> {}

class AddUnclassifiedData extends AbstractVersionResourceControl<AddUnclassifiedDataPayload> {
  protected actionCreator = Realtime.nlu.crud.add;

  protected process = async (_ctx: Context, { payload }: Action<AddUnclassifiedDataPayload>) => {
    const { versionID, value } = payload;
    await this.services.nlu.add(versionID, value);
  };
}

export default AddUnclassifiedData;
