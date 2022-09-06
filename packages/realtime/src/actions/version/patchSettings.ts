import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSettings extends AbstractVersionResourceControl<Realtime.version.PatchSettingsPayload> {
  protected actionCreator = Realtime.version.patchSettings;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSettingsPayload>) => {
    await this.services.version.patchPlatformSettings(ctx.data.creatorID, payload.versionID, payload.platform, payload.settings);
  };
}

export default PatchVersionSettings;
