import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class UpsertNote extends AbstractVersionResourceControl<Realtime.note.UpsertPayload> {
  protected actionCreator = Realtime.note.upsert;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.note.UpsertPayload>) => {
    await this.services.note.upsert(payload.versionID, payload.note);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.note.UpsertPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default UpsertNote;
