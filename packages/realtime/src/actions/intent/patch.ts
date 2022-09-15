import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, sanitizePatch } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

interface PatchIntentPayload extends Realtime.intent.BaseIntentPayload, Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Intent>> {}

class PatchIntent extends AbstractVersionResourceControl<PatchIntentPayload> {
  protected actionCreator = Realtime.intent.crud.patch;

  process = async (_ctx: Context, { payload }: Action<PatchIntentPayload>) => {
    const { versionID, key, value, projectMeta } = payload;

    await this.services.intent.update(
      versionID,
      key,
      Realtime.Adapters.getProjectTypeIntentSmartAdapter<any>(projectMeta.type).toDB(sanitizePatch(value))
    );
  };
}

export default PatchIntent;
