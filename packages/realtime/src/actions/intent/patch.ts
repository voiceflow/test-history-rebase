import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface PatchIntentPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Intent>> {}

class PatchIntent extends AbstractVersionResourceControl<PatchIntentPayload> {
  protected actionCreator = Realtime.intent.crud.patch;

  process = async (_ctx: Context, { payload }: Action<PatchIntentPayload>) => {
    const { versionID, key, value, projectMeta } = payload;

    const intents: Realtime.Intent[] = await this.services.intent
      .getAll(versionID)
      .then((intents) => Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectMeta.type).mapFromDB(intents, { platform: projectMeta.platform }));

    await this.services.intent.replaceAll(
      versionID,
      Realtime.Adapters.getProjectTypeIntentAdapter<any>(projectMeta.type).mapToDB(
        intents.map((intent) => {
          if (intent.id !== key) return intent;

          return { ...intent, ...sanitizePatch(value) };
        })
      )
    );
  };
}

export default PatchIntent;
