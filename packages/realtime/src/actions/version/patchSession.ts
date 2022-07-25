import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSession extends AbstractVersionResourceControl<Realtime.version.PatchSessionPayload> {
  protected actionCreator = Realtime.version.patchSession;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSessionPayload>) => {
    await this.services.version.patchSession(ctx.data.creatorID, payload.versionID, payload.platform, payload.session);
  };
}

export default PatchVersionSession;
