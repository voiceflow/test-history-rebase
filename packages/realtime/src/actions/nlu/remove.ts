import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface RemoveUnclassifiedDataPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveUnclassifiedData extends AbstractVersionResourceControl<RemoveUnclassifiedDataPayload> {
  protected actionCreator = Realtime.nlu.crud.remove;

  protected process = async (_ctx: Context, { payload }: Action<RemoveUnclassifiedDataPayload>) => {
    const { versionID, key } = payload;
    await this.services.nlu.remove(versionID, key);
  };

  protected finally = async (ctx: Context, { payload }: Action<RemoveUnclassifiedDataPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveUnclassifiedData;
