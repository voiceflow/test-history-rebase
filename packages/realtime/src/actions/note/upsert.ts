import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class UpsertNote extends AbstractVersionResourceControl<Realtime.note.UpsertPayload> {
  protected actionCreator = Realtime.note.upsert;

  protected process = async (ctx: Context, { payload }: Action<Realtime.note.UpsertPayload>) => {
    await this.services.note.upsert(ctx.data.creatorID, payload.versionID, payload.note);
  };
}

export default UpsertNote;
