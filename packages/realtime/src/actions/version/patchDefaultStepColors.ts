import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionDefaultStepColors extends AbstractVersionResourceControl<Realtime.version.PatchDefaultStepColorsPayload> {
  protected actionCreator = Realtime.version.patchDefaultStepColors;

  protected process = async (ctx: Context, { payload }: Action<Realtime.version.PatchDefaultStepColorsPayload>) => {
    await this.services.version.patchDefaultStepColors(ctx.data.creatorID, payload.versionID, payload.defaultStepColors);
  };
}

export default PatchVersionDefaultStepColors;
