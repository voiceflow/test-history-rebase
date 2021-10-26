import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSettings extends AbstractVersionResourceControl<Realtime.version.PatchSettingsPayload> {
  protected actionCreator = Realtime.version.patchSettings;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSettingsPayload>) => {
    await this.services.version.patchSettings(ctx.data.creatorID, payload.versionID, payload.settings);
  };
}

export default PatchVersionSettings;
