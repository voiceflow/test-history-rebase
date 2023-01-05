import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveDynamicPort extends AbstractDiagramActionControl<Realtime.BasePortPayload> {
  protected actionCreator = Realtime.port.removeDynamic;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.BasePortPayload>): Promise<void> => {
    await this.services.diagram.removeDynamicPort(payload.diagramID, payload.nodeID, payload.portID);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.BasePortPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default RemoveDynamicPort;
