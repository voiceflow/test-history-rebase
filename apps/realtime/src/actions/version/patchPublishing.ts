import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionPublishing extends AbstractVersionResourceControl<Realtime.version.PatchPublishingPayload> {
  protected actionCreator = Realtime.version.patchPublishing;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchPublishingPayload>) => {
    await this.services.version.patchPlatformPublishing({
      type: payload.type,
      platform: payload.platform,
      versionID: payload.versionID,
      creatorID: ctx.data.creatorID,
      publishing: payload.publishing,
      defaultVoice: payload.defaultVoice,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.version.PatchPublishingPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchVersionPublishing;
