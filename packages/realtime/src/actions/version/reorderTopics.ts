import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class ReorderTopics extends AbstractVersionResourceControl<Realtime.version.ReorderTopicsPayload> {
  protected actionCreator = Realtime.version.reorderTopics;

  protected process = async (ctx: Context, { payload, meta }: Action<Realtime.version.ReorderTopicsPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.version.reorderTopics(ctx.data.creatorID, payload.versionID, payload.fromID, payload.toIndex);
  };
}

export default ReorderTopics;
