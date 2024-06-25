import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class ReorderDynamicPort extends AbstractDiagramActionControl<Realtime.port.ReorderDynamicPayload> {
  protected actionCreator = Realtime.port.reorderDynamic;

  protected process = async (
    _ctx: Context,
    { payload }: Action<Realtime.port.ReorderDynamicPayload>
  ): Promise<void> => {
    await this.services.diagram.reorderPorts(
      payload.versionID,
      payload.diagramID,
      payload.nodeID,
      payload.portID,
      payload.index
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.ReorderDynamicPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default ReorderDynamicPort;
