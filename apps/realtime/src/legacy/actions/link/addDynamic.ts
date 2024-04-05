import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class AddDynamicLink extends AbstractDiagramActionControl<Realtime.link.AddDynamicPayload> {
  actionCreator = Realtime.link.addDynamic;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addDynamicLink(payload.versionID, payload.diagramID, payload.sourceNodeID, {
      portID: payload.sourcePortID,
      target: payload.targetNodeID,
      data: payload.data,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default AddDynamicLink;
