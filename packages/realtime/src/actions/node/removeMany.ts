import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractDiagramActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    const { creatorID } = ctx.data;

    if (!payload.nodes.length) return;

    const isAtomicActionsPhase2 = await this.services.workspace.isFeatureEnabled(
      creatorID,
      payload.workspaceID,
      Realtime.FeatureFlag.ATOMIC_ACTIONS_PHASE_2
    );
    if (!isAtomicActionsPhase2) return;

    await this.services.diagram.removeManyNodes(creatorID, payload.diagramID, payload.nodes, payload.nodePortRemaps);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID } = payload;
    const actionContext = { diagramID, versionID, projectID, workspaceID };

    await this.server.processAs(
      creatorID,
      Realtime.diagram.removeStartingBlocks({ ...actionContext, startingBlockIds: payload.nodes.map((node) => node.blockID) })
    );
  };
}

export default RemoveManyNodes;
