import { IO } from '@voiceflow/realtime-sdk/backend';

import type { AuthorizedCtx, AuthorizedSocket } from '../types';
import { AbstractEvent } from '../types';

class ThreadDragManyEvent extends AbstractEvent<AuthorizedCtx, IO.ThreadDragManyUserData> {
  event = IO.Event.THREAD_DRAG_MANY;

  handle = async (
    socket: AuthorizedSocket<AuthorizedCtx>,
    { threadIDs, origins, movement, versionID, diagramID }: Partial<IO.ThreadDragManyUserData>
  ) => {
    if (!threadIDs || !origins || !movement || !diagramID || !versionID)
      throw new Error('move cursor event requires nodeIDs, origins, movement, and diagramID');

    const data: IO.ThreadDragManyBroadcastData = {
      origins,
      movement,
      versionID,
      diagramID,
      creatorID: socket.ctx.user.creator_id,
      threadIDs,
    };

    await socket.to(IO.diagramChannel(versionID + diagramID)).emit(IO.Event.THREAD_DRAG_MANY, data);
  };
}

export default ThreadDragManyEvent;
