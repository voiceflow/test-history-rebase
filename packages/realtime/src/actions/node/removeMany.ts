import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionDiagramAccessActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractVersionDiagramAccessActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(payload.diagramID, payload.nodes);
  };
}

export default RemoveManyNodes;
