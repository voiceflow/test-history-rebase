import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class UpdateManyUtterances extends AbstractVersionResourceControl<Realtime.nlu.UpdateManyUtterancesPayload> {
  protected actionCreator = Realtime.nlu.updateManyUtterances;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.nlu.UpdateManyUtterancesPayload>) => {
    const { versionID, utterances } = payload;
    await this.services.nlu.updateManyUtterances(versionID, utterances);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.nlu.UpdateManyUtterancesPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default UpdateManyUtterances;
