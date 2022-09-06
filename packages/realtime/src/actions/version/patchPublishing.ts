import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionPublishing extends AbstractVersionResourceControl<Realtime.version.PatchPublishingPayload> {
  protected actionCreator = Realtime.version.patchPublishing;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchPublishingPayload>) => {
    await this.services.version.patchPlatformPublishing(ctx.data.creatorID, payload.versionID, payload.platform, payload.publishing);
  };
}

export default PatchVersionPublishing;
