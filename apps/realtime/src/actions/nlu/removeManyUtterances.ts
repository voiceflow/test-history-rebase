import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class RemoveManyUtterances extends AbstractVersionResourceControl<Realtime.nlu.RemoveManyUtterancesPayload> {
  protected actionCreator = Realtime.nlu.removeManyUtterances;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.nlu.RemoveManyUtterancesPayload>) => {
    const { versionID, utterances } = payload;
    await this.services.nlu.removeManyUtterances(versionID, utterances);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.nlu.RemoveManyUtterancesPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveManyUtterances;
