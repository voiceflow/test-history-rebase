import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionPublishing extends AbstractVersionResourceControl<Realtime.version.PatchPublishingPayload> {
  protected actionCreator = Realtime.version.patchPublishing;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchPublishingPayload>) => {
    await this.services.version.patchPublishing(Number(ctx.userId), payload.versionID, payload.publishing);
  };
}

export default PatchVersionPublishing;
