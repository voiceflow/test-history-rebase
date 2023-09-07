import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class RemoveNote extends AbstractVersionResourceControl<Realtime.note.RemovePayload> {
  protected actionCreator = Realtime.note.remove;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.note.RemovePayload>) => {
    await this.services.note.delete(payload.versionID, payload.noteID);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.note.RemovePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveNote;
