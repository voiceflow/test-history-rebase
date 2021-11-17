import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type PatchIntentPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Intent>>;

class PatchIntent extends AbstractVersionResourceControl<PatchIntentPayload> {
  protected actionCreator = Realtime.intent.crud.patch;

  process = async (ctx: Context, { payload }: Action<PatchIntentPayload>) => {
    const { creatorID } = ctx.data;
    const platform = await this.services.project.getPlatform(creatorID, payload.projectID);
    const intents: Realtime.Intent[] = await this.services.intent
      .getAll(creatorID, payload.versionID)
      .then((intents) => Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapFromDB(intents, { platform }));

    await this.services.intent.replaceAll(
      creatorID,
      payload.versionID,
      Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapToDB(
        intents.map((intent) => {
          if (intent.id !== payload.key) return intent;

          return { ...intent, ...sanitizePatch(payload.value) };
        })
      )
    );
  };
}

export default PatchIntent;
