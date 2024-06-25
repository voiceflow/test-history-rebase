import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.port.RemoveBuiltinPayload> {
  protected actionCreator = Realtime.port.removeBuiltin;

  protected process = async (
    _ctx: Context,
    { payload: { type, nodeID, versionID, diagramID, removeNodes } }: Action<Realtime.port.RemoveBuiltinPayload>
  ): Promise<void> => {
    await this.services.diagram.removeBuiltInPort(versionID, diagramID, { type, nodeID, removeNodes });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.RemoveBuiltinPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default RemoveBuiltinPort;
