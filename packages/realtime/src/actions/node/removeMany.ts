import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyNodes extends AbstractDiagramActionControl<Realtime.node.RemoveManyPayload> {
  actionCreator = Realtime.node.removeMany;

  process = async (_ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    if (!payload.nodes.length) return;

    await this.services.diagram.removeManyNodes(payload.diagramID, payload.nodes);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.RemoveManyPayload>): Promise<void> => {
    const { creatorID } = ctx.data;
    const { diagramID, versionID, projectID, workspaceID } = payload;
    const actionContext = { diagramID, versionID, projectID, workspaceID };

    await this.server.processAs(
      creatorID,
      Realtime.diagram.removeStartingBlocks({ ...actionContext, startingBlockIds: payload.nodes.map((node) => node.parentNodeID) })
    );
  };
}

export default RemoveManyNodes;
