import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from './utils';

class PatchVersionDefaultStepColors extends AbstractVersionResourceControl<Realtime.version.PatchDefaultStepColorsPayload> {
  protected actionCreator = Realtime.version.patchDefaultStepColors;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.version.PatchDefaultStepColorsPayload>) => {
    await this.services.version.patchDefaultStepColors(payload.versionID, payload.defaultStepColors);
  };

  protected finally = async (
    ctx: Context,
    { payload }: Action<Realtime.version.PatchDefaultStepColorsPayload>
  ): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchVersionDefaultStepColors;
