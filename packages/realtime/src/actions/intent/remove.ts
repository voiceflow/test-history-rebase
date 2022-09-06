import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface RemoveIntentPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDKeyPayload {}

interface RemoveIntentContextData extends BaseContextData {
  removedIntent: Realtime.VersionIntent<BaseModels.Version.PlatformData> | null;
}

class RemoveIntent extends AbstractVersionResourceControl<RemoveIntentPayload, RemoveIntentContextData> {
  protected actionCreator = Realtime.intent.crud.remove;

  protected process = async (ctx: Context<RemoveIntentContextData>, { payload }: Action<RemoveIntentPayload>) => {
    ctx.data.removedIntent = await this.services.intent.delete(payload.versionID, payload.key);
  };

  protected finally = async (ctx: Context<RemoveIntentContextData>, { payload }: Action<RemoveIntentPayload>) => {
    const { creatorID, removedIntent } = ctx.data;

    if (removedIntent?.noteID) {
      await this.server.processAs(
        creatorID,
        Realtime.note.remove({
          noteID: removedIntent.noteID,
          projectID: payload.projectID,
          versionID: payload.versionID,
          workspaceID: payload.workspaceID,
        })
      );
    }
  };
}

export default RemoveIntent;
