import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractResendDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractResendDiagramActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    const { creatorID } = ctx.data;

    if (!payload.nodes.length) return;

    const isAtomicActionsPhase2 = await this.services.workspace.isFeatureEnabled(creatorID, payload.workspaceID, 'atomic_actions_phase_2');
    if (!isAtomicActionsPhase2) return;

    await this.services.diagram.removeManyNodes(creatorID, payload.diagramID, payload.nodes);
  };
}

export default RemoveManyNodes;
