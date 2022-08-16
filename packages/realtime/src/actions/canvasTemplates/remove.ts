import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveCanvasTemplate extends AbstractVersionResourceControl<Payload> {
  protected actionCreator = Realtime.canvasTemplate.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.canvasTemplate.delete(ctx.data.creatorID, payload.versionID, payload.key);
  };
}

export default RemoveCanvasTemplate;
