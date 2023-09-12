import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectChannelControl } from '@/legacy/actions/project/utils';

type PatchThreadPayload = Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Thread>>;

class PatchThread extends AbstractProjectChannelControl<PatchThreadPayload> {
  protected actionCreator = Realtime.thread.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchThreadPayload>) => {
    const { creatorID } = ctx.data;
    await this.services.thread.update(creatorID, payload.projectID, payload.key, payload.value);
  };
}

export default PatchThread;
