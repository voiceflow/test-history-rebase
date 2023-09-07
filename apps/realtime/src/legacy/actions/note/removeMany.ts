import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

class RemoveManyNotes extends AbstractVersionResourceControl<Realtime.note.RemoveManyPayload> {
  protected actionCreator = Realtime.note.removeMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.note.RemoveManyPayload>) => {
    await this.services.note.deleteMany(payload.versionID, payload.noteIDs);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.note.RemoveManyPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveManyNotes;
