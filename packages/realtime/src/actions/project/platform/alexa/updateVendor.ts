import type { Context, ServerMeta } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl, WorkspaceContextData } from '@/actions/workspace/utils';

class UpdateVendor extends AbstractWorkspaceChannelControl<Realtime.project.alexa.UpdateVendorPayload> {
  protected actionCreator = Realtime.project.alexa.updateVendor;

  protected access = async (ctx: Context<WorkspaceContextData>, action: Action<Realtime.project.alexa.UpdateVendorPayload>, meta: ServerMeta) => {
    const hasResoureAccess = await super.access(ctx, action, meta);

    return hasResoureAccess && action.payload.creatorID === Number(ctx.userId);
  };

  protected process = async (_ctx: Context, { payload }: Action<Realtime.project.alexa.UpdateVendorPayload>): Promise<void> => {
    await this.services.project.member.updateVendor(payload.creatorID, payload.projectID, payload.vendorID, payload.skillID);
  };
}

export default UpdateVendor;
