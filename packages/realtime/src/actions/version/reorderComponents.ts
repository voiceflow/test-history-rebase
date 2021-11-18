import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class ReorderComponents extends AbstractVersionResourceControl<Realtime.version.ReorderComponentsPayload> {
  protected actionCreator = Realtime.version.reorderComponents;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.ReorderComponentsPayload>): Promise<void> => {
    await this.services.version.reorderComponents(ctx.data.creatorID, payload.versionID, payload.from, payload.to);
  };
}

export default ReorderComponents;
