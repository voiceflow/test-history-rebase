import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class UpdateNodeData extends AbstractDiagramActionControl<Realtime.node.UpdateDataPayload> {
  actionCreator = Realtime.node.updateData;

  protected access = async (ctx: Context<BaseContextData>, action: Action<Realtime.node.UpdateDataPayload>): Promise<boolean> => {
    const [hasAccess, isLocked] = await Promise.all([
      super.access(ctx, action),
      this.services.lock.isEntityLockedByType(
        ctx.nodeId,
        action.payload.diagramID,
        action.payload.nodeID,
        Realtime.diagram.awareness.LockEntityType.NODE_EDIT
      ),
    ]);

    return hasAccess && !isLocked;
  };

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateNodeData;
