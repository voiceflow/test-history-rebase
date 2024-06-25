import { IO } from '@voiceflow/realtime-sdk/backend';

import type { AuthorizedCtx, AuthorizedSocket } from '../types';
import { AbstractEvent } from '../types';

class DiagramJoin extends AbstractEvent<AuthorizedCtx, IO.DiagramChannelData> {
  event = IO.Event.DIAGRAM_LEAVE;

  handle = async (
    socket: AuthorizedSocket<AuthorizedCtx>,
    { versionID, diagramID }: Partial<IO.DiagramChannelData>
  ) => {
    if (!diagramID || !versionID) throw new Error('diagram leave event requires diagramID');

    await socket.leave(IO.diagramChannel(versionID + diagramID));
  };
}

export default DiagramJoin;
