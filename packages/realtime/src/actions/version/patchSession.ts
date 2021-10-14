import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionSession extends AbstractVersionResourceControl<Realtime.version.PatchSessionPayload> {
  protected actionCreator = Realtime.version.patchSession;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchSessionPayload>) => {
    await this.services.version.patchSession(Number(ctx.userId), payload.versionID, payload.session);
  };
}

export default PatchVersionSession;
