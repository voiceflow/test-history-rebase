import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSettings extends AbstractVersionResourceControl<Realtime.version.PatchSettingsPayload> {
  protected actionCreator = Realtime.version.patchSettings;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSettingsPayload>) => {
    await this.services.version.patchPlatformSettings({
      type: payload.type,
      settings: payload.settings,
      platform: payload.platform,
      versionID: payload.versionID,
      creatorID: ctx.data.creatorID,
      defaultVoice: payload.defaultVoice,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.version.PatchSettingsPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchVersionSettings;
