import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveCanvasTemplate extends AbstractVersionResourceControl<Payload> {
  protected actionCreator = Realtime.canvasTemplate.crud.remove;

  protected process = async (_ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.canvasTemplate.delete(payload.versionID, payload.key);
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveCanvasTemplate;
