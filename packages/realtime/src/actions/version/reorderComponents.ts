import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class ReorderComponents extends AbstractVersionResourceControl<Realtime.version.ReorderComponentsPayload> {
  protected actionCreator = Realtime.version.reorderComponents;

  protected process = async (_ctx: Context, { payload, meta }: Action<Realtime.version.ReorderComponentsPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.version.reorderComponents(payload.versionID, payload.fromID, payload.toIndex);
  };
}

export default ReorderComponents;
