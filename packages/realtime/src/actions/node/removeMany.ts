import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractResendDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractResendDiagramActionControl<Realtime.node.RemoveManyNodesPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyNodesPayload>): Promise<void> => {
    if (!payload.nodeIDs.length) return;

    const { creatorID } = ctx.data;
    const { intentStepIDs = [] } = await this.services.diagram.get(creatorID, payload.diagramID);

    await this.services.diagram.patch(creatorID, payload.diagramID, {
      intentStepIDs: Utils.array.withoutValues(intentStepIDs, payload.nodeIDs),
    });
  };
}

export default RemoveManyNodes;
