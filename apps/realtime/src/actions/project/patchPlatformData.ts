import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class PatchProjectPlatformData extends AbstractWorkspaceChannelControl<Realtime.project.PatchPlatformDataPayload> {
  protected actionCreator = Realtime.project.patchPlatformData;

  protected process = async (ctx: Context, { payload }: Action<Realtime.project.PatchPlatformDataPayload>): Promise<void> => {
    await this.services.project.patchPlatformData(ctx.data.creatorID, payload.projectID, payload.platformData);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.project.PatchPlatformDataPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchProjectPlatformData;
