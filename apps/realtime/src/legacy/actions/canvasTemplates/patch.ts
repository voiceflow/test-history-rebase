import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.canvasTemplate.PatchCanvasTemplatePayload> {}

class PatchCanvasTemplate extends AbstractVersionResourceControl<Payload> {
  protected actionCreator = Realtime.canvasTemplate.crud.patch;

  protected process = async (_ctx: Context, { payload }: Action<Payload>) => {
    const { key, value, versionID } = payload;

    await this.services.canvasTemplate.patch(versionID, key, value);
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchCanvasTemplate;
