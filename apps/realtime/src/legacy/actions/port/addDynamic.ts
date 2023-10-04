import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class AddDynamicPort extends AbstractDiagramActionControl<Realtime.port.AddDynamicPayload> {
  protected actionCreator = Realtime.port.addDynamic;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.port.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addDynamicPort(payload.versionID, payload.diagramID, payload.nodeID, {
      id: payload.portID,
      type: payload.label ?? '',
      target: null,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.port.AddDynamicPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default AddDynamicPort;
