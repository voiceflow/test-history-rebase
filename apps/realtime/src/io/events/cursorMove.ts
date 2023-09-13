import { IO } from '@voiceflow/realtime-sdk/backend';

import { AbstractEvent, AuthorizedCtx, AuthorizedSocket } from '../types';

class CursorMoveEvent extends AbstractEvent<AuthorizedCtx, IO.CursorMoveUserData> {
  event = IO.Event.CURSOR_MOVE;

  handle = async (socket: AuthorizedSocket<AuthorizedCtx>, { coords, diagramID }: Partial<IO.CursorMoveUserData>) => {
    if (!coords || !diagramID) throw new Error('move cursor event requires coords and diagramID');

    const data: IO.CursorMoveBroadcastData = {
      coords,
      diagramID,
      creatorID: socket.ctx.user.creator_id,
    };

    await socket.to(IO.diagramChannel(diagramID)).emit(IO.Event.CURSOR_MOVE, data);
  };
}

export default CursorMoveEvent;
