import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class UpdateManyNodeData extends AbstractDiagramActionControl<Realtime.node.UpdateManyDataPayload> {
  actionCreator = Realtime.node.updateDataMany;

  protected access = async (ctx: Context, action: Action<Realtime.node.UpdateManyDataPayload>): Promise<boolean> => {
    const [canRead, ...isLocked] = await Promise.all([
      this.services.diagram.access.canRead(ctx.data.creatorID, action.payload.diagramID),
      ...action.payload.nodes.map((data) =>
        this.services.lock.isEntityLockedByType(
          ctx.nodeId,
          action.payload.diagramID,
          data.nodeID,
          Realtime.diagram.awareness.LockEntityType.NODE_EDIT
        )
      ),
    ]);

    return canRead && !isLocked.some(Boolean);
  };

  process = async (ctx: Context, { payload }: Action<Realtime.node.UpdateManyDataPayload>): Promise<void> => {
    const nodes = payload.nodes.map((nodeData) => ({
      nodeID: nodeData.nodeID,
      ...Realtime.Adapters.nodeDataAdapter.toDB(nodeData, {
        platform: payload.projectMeta.platform,
        projectType: payload.projectMeta.type,
        context: {},
      }),
    }));

    await this.services.diagram.updateManyNodeData(ctx.data.creatorID, payload.diagramID, nodes);
  };
}

export default UpdateManyNodeData;
