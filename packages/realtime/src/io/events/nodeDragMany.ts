import { IO } from '@voiceflow/realtime-sdk/backend';

import { AbstractEvent, AuthorizedCtx, AuthorizedSocket } from '../types';

class NodeDragManyEvent extends AbstractEvent<AuthorizedCtx, IO.NodeDragManyUserData> {
  event = IO.Event.NODE_DRAG_MANY;

  handle = async (socket: AuthorizedSocket<AuthorizedCtx>, { nodeIDs, origins, movement, diagramID }: Partial<IO.NodeDragManyUserData>) => {
    if (!nodeIDs || !origins || !movement || !diagramID) throw new Error('move cursor event requires nodeIDs, origins, movement, and diagramID');

    const data: IO.NodeDragManyBroadcastData = {
      nodeIDs,
      origins,
      movement,
      diagramID,
      creatorID: socket.ctx.user.creator_id,
    };

    await socket.to(IO.diagramChannel(diagramID)).emit(IO.Event.NODE_DRAG_MANY, data);
  };
}

export default NodeDragManyEvent;
