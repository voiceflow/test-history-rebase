import { IO } from '@voiceflow/realtime-sdk/backend';

import type { AuthorizedCtx, AuthorizedSocket } from '../types';
import { AbstractEvent } from '../types';

class CursorMoveEvent extends AbstractEvent<AuthorizedCtx, IO.CursorMoveUserData> {
  event = IO.Event.CURSOR_MOVE;

  handle = async (
    socket: AuthorizedSocket<AuthorizedCtx>,
    { coords, versionID, diagramID }: Partial<IO.CursorMoveUserData>
  ) => {
    if (!coords || !diagramID || !versionID) throw new Error('move cursor event requires coords and diagramID');

    const data: IO.CursorMoveBroadcastData = {
      coords,
      versionID,
      diagramID,
      creatorID: socket.ctx.user.creator_id,
    };

    await socket.to(IO.diagramChannel(versionID + diagramID)).emit(IO.Event.CURSOR_MOVE, data);
  };
}

export default CursorMoveEvent;
