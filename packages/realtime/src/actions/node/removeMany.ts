import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractResendDiagramActionControl } from '@/actions/diagram/utils';
import { Context } from '@/types';

class RemoveManyNodes extends AbstractResendDiagramActionControl<Realtime.node.RemoveManyNodesPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyNodesPayload>): Promise<void> => {
    if (!payload.nodeIDs.length) return;

    const { creatorID } = ctx.data;
    const { intentStepIDs = [] } = await this.services.diagram.get(creatorID, payload.diagramID);

    await this.services.diagram.patch(creatorID, payload.diagramID, {
      intentStepIDs: Realtime.Utils.array.withoutValues(intentStepIDs, payload.nodeIDs),
    });
  };
}

export default RemoveManyNodes;
