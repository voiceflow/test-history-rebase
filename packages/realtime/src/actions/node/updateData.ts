import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class UpdateNodeData extends AbstractDiagramActionControl<Realtime.node.UpdateDataPayload> {
  actionCreator = Realtime.node.updateData;

  protected access = async (ctx: Context, action: Action<Realtime.node.UpdateDataPayload>): Promise<boolean> => {
    const [canRead, isLocked] = await Promise.all([
      this.services.diagram.canRead(ctx.data.creatorID, action.payload.diagramID),
      this.services.lock.isEntityLockedByType(
        ctx.nodeId,
        action.payload.diagramID,
        action.payload.nodeID,
        Realtime.diagram.awareness.LockEntityType.NODE_EDIT
      ),
    ]);

    return canRead && !isLocked;
  };

  process = async (ctx: Context, { payload }: Action<Realtime.node.UpdateDataPayload>): Promise<void> => {
    const { data: dbData } = Realtime.Adapters.nodeDataAdapter.toDB(payload.data, {
      platform: payload.projectMeta.platform,
      projectType: payload.projectMeta.type,
      context: {},
    });

    await this.services.diagram.updateNodeData(ctx.data.creatorID, payload.diagramID, payload.nodeID, dbData);
  };
}

export default UpdateNodeData;
