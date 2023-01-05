import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.port.BuiltinPayload> {
  protected actionCreator = Realtime.port.removeBuiltin;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.port.BuiltinPayload>): Promise<void> => {
    await this.services.diagram.removeBuiltInPort(payload.diagramID, payload.nodeID, payload.type);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.BuiltinPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default RemoveBuiltinPort;
