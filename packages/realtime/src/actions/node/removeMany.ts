import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractResendDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractResendDiagramActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(ctx.data.creatorID, payload.diagramID, payload.nodes);
  };
}

export default RemoveManyNodes;
