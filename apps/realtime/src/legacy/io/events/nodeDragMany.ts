import { IO } from '@voiceflow/realtime-sdk/backend';

import type { AuthorizedCtx, AuthorizedSocket } from '../types';
import { AbstractEvent } from '../types';

class NodeDragManyEvent extends AbstractEvent<AuthorizedCtx, IO.NodeDragManyUserData> {
  event = IO.Event.NODE_DRAG_MANY;

  handle = async (
    socket: AuthorizedSocket<AuthorizedCtx>,
    { nodeIDs, origins, movement, versionID, diagramID }: Partial<IO.NodeDragManyUserData>
  ) => {
    if (!nodeIDs || !origins || !movement || !diagramID || !versionID)
      throw new Error('move cursor event requires nodeIDs, origins, movement, and diagramID');

    const data: IO.NodeDragManyBroadcastData = {
      nodeIDs,
      origins,
      movement,
      versionID,
      diagramID,
      creatorID: socket.ctx.user.creator_id,
    };

    await socket.to(IO.diagramChannel(versionID + diagramID)).emit(IO.Event.NODE_DRAG_MANY, data);
  };
}

export default NodeDragManyEvent;
