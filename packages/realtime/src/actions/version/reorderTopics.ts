import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class ReorderTopics extends AbstractVersionResourceControl<Realtime.version.ReorderTopicsPayload> {
  protected actionCreator = Realtime.version.reorderTopics;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.ReorderTopicsPayload>): Promise<void> => {
    await this.services.version.reorderTopics(ctx.data.creatorID, payload.versionID, payload.from, payload.to);
  };
}

export default ReorderTopics;
