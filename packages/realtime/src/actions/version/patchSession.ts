import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSession extends AbstractVersionResourceControl<Realtime.version.PatchSessionPayload> {
  protected actionCreator = Realtime.version.patchSession;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSessionPayload>) => {
    await this.services.version.patchPlatformSession({
      type: payload.type,
      session: payload.session,
      platform: payload.platform,
      versionID: payload.versionID,
      creatorID: ctx.data.creatorID,
    });
  };
}

export default PatchVersionSession;
