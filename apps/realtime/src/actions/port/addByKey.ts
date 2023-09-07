import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddByKeyPort extends AbstractDiagramActionControl<Realtime.port.AddByKeyPayload> {
  protected actionCreator = Realtime.port.addByKey;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.port.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyPort(payload.diagramID, payload.nodeID, payload.key, {
      id: payload.portID,
      target: null,
      type: payload.label ?? '',
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.AddByKeyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddByKeyPort;
