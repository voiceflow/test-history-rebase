import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

interface RemoveManyIntentsPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDKeysPayload {}

interface RemoveManyIntentsContextData extends BaseContextData {
  removedIntents: BaseModels.Intent[] | null;
}

class RemoveManyIntents extends AbstractVersionResourceControl<RemoveManyIntentsPayload, RemoveManyIntentsContextData> {
  protected actionCreator = Realtime.intent.crud.removeMany;

  protected process = async (ctx: Context<RemoveManyIntentsContextData>, { payload }: Action<RemoveManyIntentsPayload>) => {
    ctx.data.removedIntents = await this.services.intent.getMany(payload.versionID, payload.keys);

    await this.services.intent.deleteMany(payload.versionID, payload.keys);
  };

  protected finally = async (ctx: Context<RemoveManyIntentsContextData>, { payload }: Action<RemoveManyIntentsPayload>) => {
    const { creatorID, clientID, removedIntents } = ctx.data;

    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);

    if (!removedIntents || removedIntents.length === 0) return;

    const noteIDsToRemove = removedIntents.filter((intent) => intent.noteID).map((intent) => intent.noteID!);

    if (noteIDsToRemove.length) {
      await this.server.processAs(
        creatorID,
        clientID,
        Realtime.note.removeMany({
          noteIDs: noteIDsToRemove,
          projectID: payload.projectID,
          versionID: payload.versionID,
          workspaceID: payload.workspaceID,
        })
      );
    }
  };
}

export default RemoveManyIntents;
